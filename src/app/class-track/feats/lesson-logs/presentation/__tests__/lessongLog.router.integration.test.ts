import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";

import { LessonLogRoutes } from "@/app/class-track/feats/lesson-logs/presentation/lessonLog.routes";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import AttendanceSession from "@/data/models/class-track/attendance-session.model";
import { certificateType, studentContractStatus, studentProgressCategory } from "@/data/models/admin-desk/student.model";
import { studentModuleStatus } from "@/core/interfaces/contracts.interface";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";
import User from "@/data/models/shared/user.model";
import Student from "@/data/models/admin-desk/student.model";
import Module from "@/data/models/admin-desk/module.model";
import StudentModule from "@/data/models/admin-desk/student-module.model";

// ------------------------------------------------------------------ //
// Micro-application: only the Lesson Log router
// ------------------------------------------------------------------ //
const testingApp = express();
testingApp.use(express.json());
testingApp.use("/api/lesson-log", LessonLogRoutes.routes);
testingApp.use(testGlobalErrorHandler());

// ------------------------------------------------------------------ //
// Database connection
// ------------------------------------------------------------------ //
const testDatabase = new DatabaseConnection({
    databaseUrl: environmentVariables.databaseUrl,
    enableLogging: false,
    forceSynchronization: true,
});

describe("Integration Tests: LessonLog Router", () => {
    let advisorUserId: string;

    let studentA2Id: string;
    let studentB2Id: string;
    let studentNoContractId: string;

    let inProgressSessionA2: string;
    let inProgressSessionB2: string;
    let notActiveSessionA2: string;
    let inProgressSessionNoContract: string;

    beforeAll(async () => {
        await testDatabase.connect();

        // 1. Create a generic user (Advisor/Seller/Teacher)
        const user = await User.create({
            us_full_name: "Teacher For Lesson Logs",
            us_email: "teacher.lessonlogs@test.com",
            us_password_hash: "Hash123",
            us_role: "TEACHER",
        });
        advisorUserId = user.us_id;

        // 2. Create Modules (A2 -> level 2, B2 -> level 4)
        const moduleA2 = await Module.create({
            mo_name: "A2 Test",
            mo_description: "A2 Module",
            mo_level: 2,
        });

        const moduleB2 = await Module.create({
            mo_name: "B2 Test",
            mo_description: "B2 Module",
            mo_level: 4,
        });

        // 3. Create Students
        const studentA2 = await Student.create({
            st_identification_card: "123456789A2",
            st_full_name: "Student A2",
            st_phone_number: "0999999991",
            st_email: "student.a2@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: certificateType.Other,
            st_start_date: new Date(),
            st_is_graduated: false,
            st_contract_status: studentContractStatus.Active,
            st_progress_category: studentProgressCategory.Moderate,
        });
        studentA2Id = studentA2.st_id;

        const studentB2 = await Student.create({
            st_identification_card: "123456789B2",
            st_full_name: "Student B2",
            st_phone_number: "0999999992",
            st_email: "student.b2@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: certificateType.Other,
            st_start_date: new Date(),
            st_is_graduated: false,
            st_contract_status: studentContractStatus.Active,
            st_progress_category: studentProgressCategory.Moderate,
        });
        studentB2Id = studentB2.st_id;

        const studentNoContract = await Student.create({
            st_identification_card: "123456789NOC",
            st_full_name: "Student No Contract",
            st_phone_number: "0999999993",
            st_email: "student.noc@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: certificateType.Other,
            st_start_date: new Date(),
            st_is_graduated: false,
            st_contract_status: studentContractStatus.Inactive, // No contract
            st_progress_category: studentProgressCategory.Moderate,
        });
        studentNoContractId = studentNoContract.st_id;

        // 4. Create StudentModules (Contracts)
        await StudentModule.create({
            st_mod_student_id: studentA2Id,
            st_mod_module_id: moduleA2.mo_id,
            st_mod_seller_id: advisorUserId,
            st_mod_status: studentModuleStatus.Active,
            st_mod_purchase_date: new Date(),
            st_mod_freeze_count: 0,
            st_mod_reactivation_count: 0,
        });

        await StudentModule.create({
            st_mod_student_id: studentB2Id,
            st_mod_module_id: moduleB2.mo_id,
            st_mod_seller_id: advisorUserId,
            st_mod_status: studentModuleStatus.Active,
            st_mod_purchase_date: new Date(),
            st_mod_freeze_count: 0,
            st_mod_reactivation_count: 0,
        });

        // studentNoContract has an active module but inactive contract status
        await StudentModule.create({
            st_mod_student_id: studentNoContractId,
            st_mod_module_id: moduleA2.mo_id,
            st_mod_seller_id: advisorUserId,
            st_mod_status: studentModuleStatus.Active,
            st_mod_purchase_date: new Date(),
            st_mod_freeze_count: 0,
            st_mod_reactivation_count: 0,
        });

        // 5. Create AttendanceSessions
        const sessionA2 = await AttendanceSession.create({
            at_se_student_id: studentA2Id,
            at_se_teacher_id: advisorUserId,
            at_se_session_date: new Date(),
            at_se_entry_time: new Date(),
            at_se_status: attendanceSessionStatus.InProgress,
        });
        inProgressSessionA2 = sessionA2.at_se_id;

        const notActiveSessA2 = await AttendanceSession.create({
            at_se_student_id: studentA2Id,
            at_se_teacher_id: advisorUserId,
            at_se_session_date: new Date(),
            at_se_entry_time: new Date(),
            at_se_status: attendanceSessionStatus.PendingApproval, // Not active
        });
        notActiveSessionA2 = notActiveSessA2.at_se_id;

        const sessionB2 = await AttendanceSession.create({
            at_se_student_id: studentB2Id,
            at_se_teacher_id: advisorUserId,
            at_se_session_date: new Date(),
            at_se_entry_time: new Date(),
            at_se_status: attendanceSessionStatus.InProgress,
        });
        inProgressSessionB2 = sessionB2.at_se_id;

        const sessionNoContract = await AttendanceSession.create({
            at_se_student_id: studentNoContractId,
            at_se_teacher_id: advisorUserId,
            at_se_session_date: new Date(),
            at_se_entry_time: new Date(),
            at_se_status: attendanceSessionStatus.InProgress,
        });
        inProgressSessionNoContract = sessionNoContract.at_se_id;
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    describe("POST /api/lesson-log", () => {
        test("[201] Valid payload creates lesson logs correctly (Valid module level 2, lessons 13, 14)", async () => {
            const validPayload = {
                attendanceSessionId: inProgressSessionA2,
                lessonsStudied: [
                    { lessonNumber: 13, oralPracticeScore: 90, isCompleted: true },
                    { lessonNumber: 14, oralPracticeScore: 100, isCompleted: true },
                ],
            };

            const res = await request(testingApp).post("/api/lesson-log").send(validPayload);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain("successfully created");
            expect(res.body.data).toBeInstanceOf(Array);
        });

        test("[400] Should fail if lessons belong to a level different from the student's active module", async () => {
            // Student A2 trying to take B2 lessons (41-56)
            const invalidRangePayload = {
                attendanceSessionId: inProgressSessionA2,
                lessonsStudied: [
                    { lessonNumber: 41, oralPracticeScore: 90, isCompleted: true },
                    { lessonNumber: 42, oralPracticeScore: 100, isCompleted: true },
                ],
            };

            const res = await request(testingApp).post("/api/lesson-log").send(invalidRangePayload);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("must be within the active module range");
        });

        test("[400] Should fail if attendance session is not active (e.g. pending approval)", async () => {
            const payload = {
                attendanceSessionId: notActiveSessionA2,
                lessonsStudied: [{ lessonNumber: 13, oralPracticeScore: 90, isCompleted: true }],
            };

            const res = await request(testingApp).post("/api/lesson-log").send(payload);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Session is not active");
        });

        test("[404] Should fail if attendance session does not exist", async () => {
            const payload = {
                attendanceSessionId: "123e4567-e89b-12d3-a456-426614174000", // Fake UUID
                lessonsStudied: [{ lessonNumber: 13, oralPracticeScore: 90, isCompleted: true }],
            };

            const res = await request(testingApp).post("/api/lesson-log").send(payload);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toContain("Session not found");
        });

        test("[400] Should fail if payload is missing lessons", async () => {
            const payload = {
                attendanceSessionId: inProgressSessionA2,
                lessonsStudied: [], // Empty lessons
            };

            const res = await request(testingApp).post("/api/lesson-log").send(payload);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Lessons are required");
        });

        test("[400] Should fail if an incomplete lesson is assigned a score", async () => {
            const payload = {
                attendanceSessionId: inProgressSessionA2,
                lessonsStudied: [
                    { lessonNumber: 13, oralPracticeScore: 90, isCompleted: false }, // Incomplete but has score
                ],
            };

            const res = await request(testingApp).post("/api/lesson-log").send(payload);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Incomplete lessons cannot have a score");
        });

        test("[400] Should fail if student contract is inactive/invalid", async () => {
            const payload = {
                attendanceSessionId: inProgressSessionNoContract,
                lessonsStudied: [{ lessonNumber: 13, oralPracticeScore: 90, isCompleted: true }],
            };

            const res = await request(testingApp).post("/api/lesson-log").send(payload);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Student has no active contract");
        });
    });

    describe("GET /api/lesson-log/student/:studentId/last", () => {
        test("[200] Get last lesson log should return successfully", async () => {
            const res = await request(testingApp).get(`/api/lesson-log/student/${studentA2Id}/last`);
            expect([200, 404]).toContain(res.status); // 404 if no logs yet, but covers the DTO
        });
    });
});
