import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";

import { RetentionAlertRoutes } from "@/app/class-track/feats/retention-alerts/presentation/retentionAlert.routes";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { User } from "@/data/models/shared";
import { Student } from "@/data/models/admin-desk";
import RetentionAlert from "@/data/models/class-track/retention-alert.model";
import { JwtAdapter, BcryptAdapter } from "@/core/utils";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { certificateType } from "@/data/models/admin-desk/student.model";

// ------------------------------------------------------------------ //

// Micro-application: only the RetentionAlert router
// ------------------------------------------------------------------ //
const testingApp = express();
testingApp.use(express.json());
testingApp.use("/api/class-track/retention-alerts", RetentionAlertRoutes.routes);
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
const ADMIN_EMAIL = "admin.retention@test.com";
const ADMIN_PASSWORD = "AdminPass1!";
const TEACHER_EMAIL = "teacher.retention@test.com";
const ADVISOR_EMAIL = "advisor.retention@test.com";

describe("Integration Tests: RetentionAlert Router", () => {
    let adminToken: string;
    let advisorToken: string;

    let adminUserId: string;
    let targetStudentId: string;
    let retentionAlertId: string;

    beforeAll(async () => {
        await testDatabase.connect();

        AuthMiddleware.configure(async (userId: string) => {
            const user = await User.findByPk(userId);
            return user ? user.us_is_active : false;
        });

        // 1. Inject Admin (Can do everything)
        const hashedPassword = await BcryptAdapter.hash(ADMIN_PASSWORD);
        const adminUser = await User.create({
            us_full_name: "Admin Retention Tester",
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

        // 2. Inject Advisor (Cannot read/write ClassTrack in this context, or maybe can't write, let's test RBAC)
        // Usually, Advisor has ONLY READ to Modules, full access to Students, but no ClassTrack permissions.
        const advisorUser = await User.create({
            us_full_name: "Advisor Retention Tester",
            us_email: ADVISOR_EMAIL,
            us_password_hash: hashedPassword,
            us_role: "ADVISOR",
        });
        advisorToken = (await JwtAdapter.generateToken({
            id: advisorUser.us_id,
            email: advisorUser.us_email,
            role: advisorUser.us_role,
        })) as string;

        // 3. Inject Student
        const student = await Student.create({
            st_identification_card: "1722222222",
            st_full_name: "Student Retention Target",
            st_phone_number: "0988888888",
            st_email: "student.ret@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: certificateType.Toefl,
            st_start_date: new Date("2024-01-01"),
            st_contract_status: "ACTIVE",
            st_progress_category: "MODERATE",
            st_is_graduated: false,
        });
        targetStudentId = student.st_id;

        // 4. Inject a Retention Alert
        const alert = await RetentionAlert.create({
            re_al_student_id: targetStudentId,
            re_al_days_absent: 10,
            re_al_status: "PENDING",
            re_al_contact_date: new Date(),
            re_al_has_responded: false,
            re_al_is_justified: false,
            re_al_observations: "Student has been absent for 10 days.",
        });
        retentionAlertId = alert.re_al_id;
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    // ---------------------------------------------------------------- //
    // GET /api/class-track/retention-alerts
    // ---------------------------------------------------------------- //
    describe("GET /api/class-track/retention-alerts", () => {
        test("[200] Should return a paginated list of retention alerts", async () => {
            const res = await request(testingApp)
                .get("/api/class-track/retention-alerts?page=1&limit=10")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data.data)).toBe(true);
            expect(res.body.data.data.length).toBeGreaterThan(0);
        });

        test("[400] Missing 'page' should return validation error", async () => {
            const res = await request(testingApp).get("/api/class-track/retention-alerts").set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("page");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/class-track/retention-alerts/:id
    // ---------------------------------------------------------------- //
    describe("PATCH /api/class-track/retention-alerts/:id", () => {
        test("[200] Valid payload should update the retention alert details", async () => {
            const res = await request(testingApp)
                .patch(`/api/class-track/retention-alerts/${retentionAlertId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    hasResponded: true,
                    isJustified: true,
                    observations: "Student answered the call and justified absence.",
                    justificationReason: "Medical issues",
                    contactDate: new Date(),
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.reAlHasResponded).toBe(true);
            expect(res.body.data.reAlIsJustified).toBe(true);
            expect(res.body.data.reAlJustificationReason).toBe("Medical issues");
        });

        test("[400] Invalid payload (isJustified true but missing reason) should fail", async () => {
            const res = await request(testingApp)
                .patch(`/api/class-track/retention-alerts/${retentionAlertId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    hasResponded: true,
                    isJustified: true,
                    observations: "Test",
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("justificationReason");
        });

        test("[404] Update non-existent retention alert should fail", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000";
            const res = await request(testingApp)
                .patch(`/api/class-track/retention-alerts/${fakeId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    hasResponded: true,
                    isJustified: false,
                    observations: "Test",
                });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toContain("Retention alert not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/class-track/retention-alerts/:id/status
    // ---------------------------------------------------------------- //
    describe("PATCH /api/class-track/retention-alerts/:id/status", () => {
        test("[200] Valid payload should change the status", async () => {
            const res = await request(testingApp)
                .patch(`/api/class-track/retention-alerts/${retentionAlertId}/status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    status: "RESOLVED",
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.reAlStatus).toBe("RESOLVED");
        });

        test("[400] Invalid status should fail", async () => {
            const res = await request(testingApp)
                .patch(`/api/class-track/retention-alerts/${retentionAlertId}/status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    status: "UNKNOWN_STATUS",
                });

            expect(res.status).toBe(400);
        });
    });

    // ---------------------------------------------------------------- //
    // Authorization & Permissions (RBAC)
    // ---------------------------------------------------------------- //
    describe("Authorization & Permissions (RBAC)", () => {
        test("[403] Advisor lacks CLASSTRACK_RETENTION_ALERTS_READ for GET /", async () => {
            const res = await request(testingApp)
                .get("/api/class-track/retention-alerts?page=1")
                .set("Authorization", `Bearer ${advisorToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Advisor lacks CLASSTRACK_RETENTION_ALERTS_WRITE for PATCH /:id", async () => {
            const res = await request(testingApp)
                .patch(`/api/class-track/retention-alerts/${retentionAlertId}`)
                .set("Authorization", `Bearer ${advisorToken}`)
                .send({
                    hasResponded: true,
                    isJustified: false,
                    observations: "Test",
                });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });
    });
});
