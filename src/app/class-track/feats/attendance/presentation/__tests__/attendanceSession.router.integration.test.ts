import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";

import { AttendanceSessionRouter } from "@/app/class-track/feats/attendance/presentation/routes/attendanceSession.router";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/dbPostgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { User } from "@/data/models/shared";
import { Student, Module, StudentModule } from "@/data/models/admin-desk";
import AttendanceSession from "@/data/models/class-track/AttendanceSession.model";
import { JwtAdapter, BcryptAdapter } from "@/core/utils";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { certificateType } from "@/data/models/admin-desk/Student.model";
import { headerConstants, clientContextValues } from "@/core/constants/ClientContext";

// ------------------------------------------------------------------ //
// Micro-application: only the Attendance router
// ------------------------------------------------------------------ //
const testingApp = express();
testingApp.use(express.json());
testingApp.use("/api/attendance", AttendanceSessionRouter.routes);
testingApp.use(testGlobalErrorHandler());

// ------------------------------------------------------------------ //
// Database connection
// ------------------------------------------------------------------ //
const testDatabase = new DatabaseConnection({
    databaseUrl: environmentVariables.databaseUrl,
    enableLogging: false,
    forceSynchronization: true,
});

// ------------------------------------------------------------------ //
// Shared constants
// ------------------------------------------------------------------ //
const ADMIN_EMAIL = "admin.attendance@test.com";
const ADMIN_PASSWORD = "AdminPass1!";
const TEACHER_EMAIL = "teacher.attendance@test.com";
const ADVISOR_EMAIL = "advisor.attendance@test.com";

describe("Integration Tests: AttendanceSession Router", () => {
    let adminToken: string;

    let advisorToken: string;

    let adminUserId: string;
    let teacherUserId: string;

    let targetStudentId: string;

    let inProgressSessionId: string;
    let pendingApprovalSessionId: string;
    let completedSessionId: string;

    beforeAll(async () => {
        await testDatabase.connect();

        AuthMiddleware.configure(async (userId: string) => {
            const user = await User.findByPk(userId);
            return user ? user.us_is_active : false;
        });

        // 1. Inject Admin (Can do everything)
        const hashedPassword = await BcryptAdapter.hash(ADMIN_PASSWORD);
        const adminUser = await User.create({
            us_full_name: "Admin Attendance Tester",
            us_email: ADMIN_EMAIL,
            us_password_hash: hashedPassword,
            us_role: "ADMIN",
        });
        adminUserId = adminUser.us_id;
        adminToken = (await JwtAdapter.generateToken({
            id: adminUser.us_id,
            email: adminUser.us_email,
            role: adminUser.us_role,
        })) as string;

        // 2. Inject Teacher (Can read/write ClassTrack)
        const teacherUser = await User.create({
            us_full_name: "Teacher Tester",
            us_email: TEACHER_EMAIL,
            us_password_hash: hashedPassword,
            us_role: "TEACHER",
        });
        teacherUserId = teacherUser.us_id;

        // 3. Inject Advisor (Cannot write ClassTrack, used for RBAC)
        const advisorUser = await User.create({
            us_full_name: "Advisor Tester",
            us_email: ADVISOR_EMAIL,
            us_password_hash: hashedPassword,
            us_role: "ADVISOR",
        });
        advisorToken = (await JwtAdapter.generateToken({
            id: advisorUser.us_id,
            email: advisorUser.us_email,
            role: advisorUser.us_role,
        })) as string;

        // 4. Inject Student
        const student = await Student.create({
            st_identification_card: "1711111111",
            st_full_name: "Student Attendance Target",
            st_phone_number: "0999999999",
            st_email: "student.att@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: certificateType.Toefl,
            st_start_date: new Date("2024-01-01"),
            st_contract_status: "ACTIVE",
            st_progress_category: "MODERATE",
            st_is_graduated: false,
        });
        targetStudentId = student.st_id;

        // 5. Inject Module & StudentModule
        const module = await Module.create({
            mo_name: "Attendance Module",
            mo_description: "A test module",
            mo_level: 1,
        });

        await StudentModule.create({
            st_mod_student_id: targetStudentId,
            st_mod_module_id: module.mo_id,
            st_mod_seller_id: adminUserId,
            st_mod_status: "ACTIVE",
            st_mod_purchase_date: new Date(),
            st_mod_freeze_count: 0,
            st_mod_reactivation_count: 0,
        });

        // 6. Inject predefined Attendance Sessions for GET & PATCH endpoints
        const inProgressSession = await AttendanceSession.create({
            at_se_student_id: targetStudentId,
            at_se_session_date: new Date(),
            at_se_entry_time: new Date(),
            at_se_status: "IN_PROGRESS",
        });
        inProgressSessionId = inProgressSession.at_se_id;

        const pendingApprovalSession = await AttendanceSession.create({
            at_se_student_id: targetStudentId,
            at_se_session_date: new Date(),
            at_se_entry_time: new Date(Date.now() - 3600000), // 1 hour ago
            at_se_exit_time: new Date(),
            at_se_total_minutes: 60,
            at_se_status: "PENDING_APPROVAL",
        });
        pendingApprovalSessionId = pendingApprovalSession.at_se_id;

        const completedSession = await AttendanceSession.create({
            at_se_student_id: targetStudentId,
            at_se_teacher_id: adminUserId,
            at_se_session_date: new Date(),
            at_se_entry_time: new Date(Date.now() - 7200000),
            at_se_exit_time: new Date(Date.now() - 3600000),
            at_se_total_minutes: 60,
            at_se_status: "APPROVED",
        });
        completedSessionId = completedSession.at_se_id;
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    // ---------------------------------------------------------------- //
    // POST /api/attendance/check-in
    // ---------------------------------------------------------------- //
    describe("POST /api/attendance/check-in", () => {
        test("[400] Missing 'studentId' should fail", async () => {
            const res = await request(testingApp)
                .post("/api/attendance/check-in")
                .set(headerConstants.clientContextName, clientContextValues.classTrackStudent)
                .send({ entryTime: new Date() });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing student");
        });

        test("[201] Valid payload should create an IN_PROGRESS session", async () => {
            const res = await request(testingApp)
                .post("/api/attendance/check-in")
                .set(headerConstants.clientContextName, clientContextValues.classTrackStudent)
                .send({
                    studentId: targetStudentId,
                    entryTime: new Date(),
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Check-in successful");
            expect(res.body.data.atSeStatus).toBe("IN_PROGRESS");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/attendance/check-out
    // ---------------------------------------------------------------- //
    describe("PATCH /api/attendance/check-out", () => {
        test("[400] Missing X-Client-Context header should fail", async () => {
            const res = await request(testingApp).patch("/api/attendance/check-out").send({
                sessionId: inProgressSessionId,
                exitTime: new Date(),
            });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid or missing client context header");
        });

        test("[400] Missing 'sessionId' should fail", async () => {
            const res = await request(testingApp)
                .patch("/api/attendance/check-out")
                .set(headerConstants.clientContextName, clientContextValues.salcPortal)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ exitTime: new Date() });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing sessionId");
        });

        test("[200] Valid payload should update session to PENDING_APPROVAL", async () => {
            const res = await request(testingApp)
                .patch("/api/attendance/check-out")
                .set(headerConstants.clientContextName, clientContextValues.salcPortal)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    sessionId: inProgressSessionId,
                    exitTime: new Date(),
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Check-out successful");
            expect(res.body.data.atSeStatus).toBe("PENDING_APPROVAL");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/attendance/approve
    // ---------------------------------------------------------------- //
    describe("PATCH /api/attendance/approve", () => {
        test("[401] Without token should fail", async () => {
            const res = await request(testingApp)
                .patch("/api/attendance/approve")
                .send({ sessionId: pendingApprovalSessionId, teacherId: teacherUserId });

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[200] Valid payload should approve session", async () => {
            const res = await request(testingApp).patch("/api/attendance/approve").set("Authorization", `Bearer ${adminToken}`).send({
                sessionId: pendingApprovalSessionId,
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Check-out approved successfully");
            expect(res.body.data.atSeStatus).toBe("APPROVED");
        });
    });

    // ---------------------------------------------------------------- //
    // GET Endpoints
    // ---------------------------------------------------------------- //
    describe("GET Active Sessions Endpoints", () => {
        test("[200] GET /api/attendance/in-progress", async () => {
            const res = await request(testingApp).get("/api/attendance/in-progress").set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test("[200] GET /api/attendance/pending-approval", async () => {
            const res = await request(testingApp).get("/api/attendance/pending-approval").set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test("[200] GET /api/attendance/completed", async () => {
            const res = await request(testingApp).get("/api/attendance/completed").set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    // ---------------------------------------------------------------- //
    // Authorization & Permissions (RBAC)
    // ---------------------------------------------------------------- //
    describe("Authorization & Permissions (RBAC)", () => {
        test("[403] Advisor lacks CLASSTRACK_ATTENDANCE_WRITE for PATCH /approve", async () => {
            const res = await request(testingApp)
                .patch("/api/attendance/approve")
                .set("Authorization", `Bearer ${advisorToken}`)
                .send({ sessionId: completedSessionId, teacherId: adminUserId });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Advisor lacks CLASSTRACK_ATTENDANCE_READ for GET /in-progress", async () => {
            const res = await request(testingApp).get("/api/attendance/in-progress").set("Authorization", `Bearer ${advisorToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });
    });
});
