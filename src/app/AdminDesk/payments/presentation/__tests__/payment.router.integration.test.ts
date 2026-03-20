import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";

import { PaymentRouter } from "@/app/AdminDesk/payments/presentation/router";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { User } from "@/data/models/Shared";
import { Student } from "@/data/models/AdminDesk";
import { JwtAdapter, BcryptAdapter } from "@/core/utils";
import { systemPermissions } from "@/core/constants";
import { userRoles } from "@/core/interfaces";
import PaymentQuota from "@/data/models/AdminDesk/PaymentQuota.model";

// ------------------------------------------------------------------ //
// Micro-application: only the Payments router
// ------------------------------------------------------------------ //
const testingPaymentApp = express();
testingPaymentApp.use(express.json());
testingPaymentApp.use("/api/payments", PaymentRouter.routes);
testingPaymentApp.use(testGlobalErrorHandler());

// ------------------------------------------------------------------ //
// Database: force-sync drops and recreates all tables
// ------------------------------------------------------------------ //
const testDatabase = new DatabaseConnection({
    databaseUrl: environmentVariables.databaseUrl,
    enableLogging: false,
    forceSynchronization: true,
});

// ------------------------------------------------------------------ //
// Shared constants & Mock Data
// ------------------------------------------------------------------ //
const ADMIN_EMAIL = "admin.payment.tester@test.com";
const TEACHER_EMAIL = "teacher.payment.tester@test.com";
const TEST_PASSWORD = "AdminPass1!";

const NON_EXISTENT_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

const VALID_PLAN_PAYLOAD = {
    totalAmount: 1200.00,
    enrollmentFee: 50.00,
    isSinglePayment: false,
    numberOfQuotas: 12,
    firstQuotaDueDate: "2024-04-01T00:00:00.000Z",
};

// ------------------------------------------------------------------ //
// Test suite
// ------------------------------------------------------------------ //
describe("Integration Tests: Payments Router", () => {

    let adminToken: string;
    let teacherToken: string;
    let testStudentId: string;
    let testPlanId: string;
    let testQuotaId: string;

    beforeAll(async () => {
        await testDatabase.connect();

        // 1. Inject Admin user (Authorized)
        const hashedAdminPassword = await BcryptAdapter.hash(TEST_PASSWORD);
        const adminUser = await User.create({
            us_full_name: "Admin Payment Tester",
            us_email: ADMIN_EMAIL,
            us_password_hash: hashedAdminPassword,
            us_role: userRoles.ADMIN,
        });

        adminToken = (await JwtAdapter.generateToken({
            id: adminUser.us_id,
            email: adminUser.us_email,
            role: adminUser.us_role,
        })) || "";

        // 2. Inject Teacher user (Unauthorized for payments)
        const hashedTeacherPassword = await BcryptAdapter.hash(TEST_PASSWORD);
        const teacherUser = await User.create({
            us_full_name: "Teacher Payment Tester",
            us_email: TEACHER_EMAIL,
            us_password_hash: hashedTeacherPassword,
            us_role: userRoles.TEACHER,
        });

        teacherToken = (await JwtAdapter.generateToken({
            id: teacherUser.us_id,
            email: teacherUser.us_email,
            role: teacherUser.us_role,
        })) || "";

        // 3. Inject a Test Student
        const student = await Student.create({
            st_identification_card: "1724567890",
            st_full_name: "John Payment Test",
            st_phone_number: "0987654321",
            st_email: "john.payment@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: "TOEFL",
            st_start_date: new Date(),
            st_contract_status: "ACTIVE",
            st_progress_category: "NOT_ENOUGH_DATA",
            st_is_graduated: false,
        });
        testStudentId = student.st_id;
    });

    // --- RBAC SUITE ---
    describe("Authorization & Permissions (RBAC)", () => {
        test("[403] Should deny access to POST /api/payments/student/:studentId/plan if user lacks ADMINDESK_PAYMENTS_WRITE", async () => {
            const res = await request(testingPaymentApp)
                .post(`/api/payments/student/${testStudentId}/plan`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send(VALID_PLAN_PAYLOAD);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to GET /api/payments/student/:studentId if user lacks ADMINDESK_PAYMENTS_READ", async () => {
            const res = await request(testingPaymentApp)
                .get(`/api/payments/student/${testStudentId}`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to PATCH /api/payments/quota/:quotaId/pay if user lacks ADMINDESK_PAYMENTS_WRITE", async () => {
            const res = await request(testingPaymentApp)
                .patch(`/api/payments/quota/${NON_EXISTENT_UUID}/pay`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({ amountPaid: 100, paymentMethod: "CASH" });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to POST /api/payments/quota/:quotaId/revert if user lacks ADMINDESK_PAYMENTS_WRITE", async () => {
            const res = await request(testingPaymentApp)
                .post(`/api/payments/quota/${NON_EXISTENT_UUID}/revert`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });
    });

    // --- CREATE PLAN SUITE ---
    describe("POST /api/payments/student/:studentId/plan", () => {
        test("[201] Should create a payment plan successfully with valid payload", async () => {
            const res = await request(testingPaymentApp)
                .post(`/api/payments/student/${testStudentId}/plan`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send(VALID_PLAN_PAYLOAD);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.totalAmount).toBe(VALID_PLAN_PAYLOAD.totalAmount);
            expect(res.body.data.quotas.length).toBe(VALID_PLAN_PAYLOAD.numberOfQuotas);

            testPlanId = res.body.data.id;
            testQuotaId = res.body.data.quotas[0].id;
        });

        test("[400] Should fail if totalAmount is missing", async () => {
            const { totalAmount, ...payloadWithoutTotal } = VALID_PLAN_PAYLOAD;
            const res = await request(testingPaymentApp)
                .post(`/api/payments/student/${testStudentId}/plan`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payloadWithoutTotal);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("totalAmount");
        });

        test("[400] Should fail if numberOfQuotas is invalid (less than 1)", async () => {
            const res = await request(testingPaymentApp)
                .post(`/api/payments/student/${testStudentId}/plan`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ ...VALID_PLAN_PAYLOAD, numberOfQuotas: 0, isSinglePayment: false });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("numberOfQuotas");
        });

        test("[400] Should fail if firstQuotaDueDate is an invalid date string", async () => {
            const res = await request(testingPaymentApp)
                .post(`/api/payments/student/${testStudentId}/plan`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ ...VALID_PLAN_PAYLOAD, firstQuotaDueDate: "not-a-real-date" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("firstQuotaDueDate format");
        });

    });

    // --- GET PLANS SUITE ---
    describe("GET /api/payments/student/:studentId", () => {
        test("[200] Should return an array of payment plans for the student", async () => {
            const res = await request(testingPaymentApp)
                .get(`/api/payments/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    // --- PAY QUOTA SUITE ---
    describe("PATCH /api/payments/quota/:quotaId/pay", () => {
        test("[200] Should process a total payment for a quota successfully", async () => {
            const quota = await PaymentQuota.findByPk(testQuotaId);
            const totalToPay = Number(quota?.pq_total_expected);

            const res = await request(testingPaymentApp)
                .patch(`/api/payments/quota/${testQuotaId}/pay`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    amountPaid: totalToPay,
                    paymentMethod: "TRANSFER"
                });

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe("PAID");
            expect(Number(res.body.data.amountPaid)).toBe(totalToPay);
        });

        test("[400] Should fail if amountPaid exceeds expected total", async () => {
            // Find second quota of the plan created before
            const nextQuota = await PaymentQuota.findOne({ where: { pq_quota_number: 2, pq_payment_plan_id: testPlanId } });
            const quotaId = nextQuota?.pq_id;
            const tooMuch = Number(nextQuota?.pq_total_expected) + 100;

            const res = await request(testingPaymentApp)
                .patch(`/api/payments/quota/${quotaId}/pay`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    amountPaid: tooMuch,
                    paymentMethod: "CASH"
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("exceed");
        });

        test("[400] Should fail if paymentMethod is invalid", async () => {
            const res = await request(testingPaymentApp)
                .patch(`/api/payments/quota/${testQuotaId}/pay`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    amountPaid: 10,
                    paymentMethod: "BITCOIN"
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("paymentMethod");
        });

        test("[400] Should fail if amountPaid is zero or negative", async () => {
            const res = await request(testingPaymentApp)
                .patch(`/api/payments/quota/${testQuotaId}/pay`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ amountPaid: -50, paymentMethod: "CASH" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("amountPaid must be greater than 0");
        });
    });

    // --- REVERT PAYMENT SUITE ---
    describe("POST /api/payments/quota/:quotaId/revert", () => {
        test("[200] Should revert a payment successfully", async () => {
            const res = await request(testingPaymentApp)
                .post(`/api/payments/quota/${testQuotaId}/revert`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toContain("reverted");

            // Verify manually via DB
            const updatedQuota = await PaymentQuota.findByPk(testQuotaId);
            expect(updatedQuota?.pq_status).toBe("PENDING");
            expect(Number(updatedQuota?.pq_amount_paid)).toBe(0);
        });
    });

    // --- Middleware ---
    describe("Validation UUID", () => {
        test("[400] Should fail if quotaId parameter is not a valid UUID", async () => {
            const res = await request(testingPaymentApp)
                .post(`/api/payments/quota/12345-invalid-uuid/revert`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message.toLowerCase()).toContain("invalid item");
        });
    });

});
