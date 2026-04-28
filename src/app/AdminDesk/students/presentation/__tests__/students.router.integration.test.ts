import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";

import { StudentsRouter } from "@/app/AdminDesk/students/presentation/router";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { User } from "@/data/models/Shared";
import { Student } from "@/data/models/AdminDesk";
import { JwtAdapter, BcryptAdapter } from "@/core/utils";
import { AuthMiddleware } from "@/core/middleware/auth.mid";

// ------------------------------------------------------------------ //
// Micro-application: only the Students router (no other routes needed)
// ------------------------------------------------------------------ //
const testingStudentApp = express();
testingStudentApp.use(express.json());
testingStudentApp.use("/api/students", StudentsRouter.routes);
testingStudentApp.use(testGlobalErrorHandler());

// ------------------------------------------------------------------ //
// Database: force-sync drops and recreates all tables
// ------------------------------------------------------------------ //

console.log('environmentVariables.databaseUrl');
console.log(environmentVariables.databaseUrl);
const testDatabase = new DatabaseConnection({
    databaseUrl: environmentVariables.databaseUrl,
    enableLogging: false,
    forceSynchronization: true,
});


// ------------------------------------------------------------------ //
// Shared constants
// ------------------------------------------------------------------ //
const ADMIN_EMAIL = "admin.student.tester@test.com";
const ADMIN_PASSWORD = "AdminPass1!";

const NON_EXISTENT_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const MALFORMED_ID = "not-a-uuid";

const VALID_STUDENT_PAYLOAD = {
    identificationCard: "1234567890",
    fullName: "Juan Pérez García",
    phoneNumber: "0987654321",
    email: "test.student.post@integration.com",
    dateOfBirth: "2000-01-01",
    nationality: "Ecuadorian",
    certificateType: "TOEFL",
    startDate: "2024-01-15",
};

const SECOND_STUDENT_CI = "0987654321";

// ------------------------------------------------------------------ //
// Test suite
// ------------------------------------------------------------------ //
describe("Integration Tests: Students Router (Authenticated)", () => {

    let adminToken: string;
    let targetStudentId: string;
    let secondStudentId: string;

    beforeAll(async () => {
        await testDatabase.connect();

        AuthMiddleware.configure(async (userId: string) => {
            const user = await User.findByPk(userId);
            return user ? user.us_is_active : false;
        });

        // Inject an Admin user directly via Sequelize
        const hashedPassword = await BcryptAdapter.hash(ADMIN_PASSWORD);
        const adminUser = await User.create({
            us_full_name: "Admin Student Tester",
            us_email: ADMIN_EMAIL,
            us_password_hash: hashedPassword,
            us_role: "ADMIN",
        });

        // Generate a valid JWT for all authenticated requests
        const token = await JwtAdapter.generateToken({
            id: adminUser.us_id,
            email: adminUser.us_email,
            role: adminUser.us_role,
        });

        if (!token) throw new Error("Test setup failed: could not generate JWT");
        adminToken = token;

        // Inject the first test student (ACTIVE, not graduated)
        const firstStudent = await Student.create({
            st_identification_card: VALID_STUDENT_PAYLOAD.identificationCard,
            st_full_name: VALID_STUDENT_PAYLOAD.fullName,
            st_phone_number: VALID_STUDENT_PAYLOAD.phoneNumber,
            st_email: "first.student@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: "TOEFL",
            st_start_date: new Date(VALID_STUDENT_PAYLOAD.startDate),
            st_contract_status: "ACTIVE",
            st_progress_category: "NOT_ENOUGH_DATA",
            st_is_graduated: false,
        });
        targetStudentId = firstStudent.st_id;

        // Inject the second test student (FROZEN, for search tests)
        const secondStudent = await Student.create({
            st_identification_card: SECOND_STUDENT_CI,
            st_full_name: "Maria Lopez Torres",
            st_phone_number: "0912345678",
            st_email: "maria.lopez@test.com",
            st_date_of_birth: new Date("1995-05-15"),
            st_nationality: "Ecuadorian",
            st_certificate_type: "ONE_TONNE",
            st_start_date: new Date("2023-06-01"),
            st_contract_status: "FROZEN",
            st_progress_category: "MODERATE",
            st_is_graduated: false,
        });
        secondStudentId = secondStudent.st_id;
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    // ---------------------------------------------------------------- //
    // AUTH — [401] Unauthenticated access
    // ---------------------------------------------------------------- //
    describe("Authentication guard", () => {

        test("[401] POST /api/students/register without token should be rejected", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .send(VALID_STUDENT_PAYLOAD);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] GET /api/students/search without token should be rejected", async () => {
            const res = await request(testingStudentApp)
                .get("/api/students/search?q=Juan");

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] PATCH /api/students/:id without token should be rejected", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${NON_EXISTENT_UUID}`)
                .send({ fullName: "Hacker" });

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] Authorization header without 'Bearer ' prefix should be rejected", async () => {
            const res = await request(testingStudentApp)
                .get("/api/students/search")
                .set("Authorization", adminToken);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] GET /api/students/search with invalid token should return unauthorized", async () => {
            const res = await request(testingStudentApp)
                .get("/api/students/search")
                .set("Authorization", "Bearer this.is.not.valid");

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("errors");
        });

        test("[401] Active false user should return 'Your account has been deactivated...'", async () => {
            const deactivatedUser = await User.create({
                us_full_name: "Deactivated Tester",
                us_email: "deact.student@test.com",
                us_password_hash: "MockHash123!",
                us_role: "TEACHER",
                us_is_active: false
            });
            const deactivatedToken = await JwtAdapter.generateToken({
                id: deactivatedUser.us_id,
                email: deactivatedUser.us_email,
                role: deactivatedUser.us_role,
            });

            const res = await request(testingStudentApp)
                .get("/api/students/search?q=Juan")
                .set("Authorization", `Bearer ${deactivatedToken}`);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("Your account has been deactivated by an administrator");
        });
    });

    // ---------------------------------------------------------------- //
    // POST /api/students/register — Register student
    // ---------------------------------------------------------------- //
    describe("POST /api/students/register", () => {

        test("[400] Missing 'identificationCard' should return validation error", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ fullName: "Test Student", phoneNumber: "0987654321", startDate: "2024-01-01" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing identificationCard");
        });

        test("[400] Missing 'fullName' should return validation error", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ identificationCard: "1724567890", phoneNumber: "0987654321", startDate: "2024-01-01" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing fullName");
        });

        test("[400] Missing 'phoneNumber' should return validation error", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ identificationCard: "1724567890", fullName: "Test Student", startDate: "2024-01-01" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing phoneNumber");
        });

        test("[400] Missing 'startDate' should return validation error", async () => {
            // Hacemos una copia del payload válido, pero extraemos y descartamos 'startDate'
            const { startDate, ...payloadWithoutStartDate } = VALID_STUDENT_PAYLOAD;

            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(payloadWithoutStartDate);

            expect(res.status).toBe(400);
            // Ahora sí pasará los filtros nuevos y caerá exactamente en el error de startDate
            expect(res.body.errors[0].message).toContain("startDate");
        });

        test("[400] identificationCard with less than 10 digits should fail", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ ...VALID_STUDENT_PAYLOAD, identificationCard: "123456789" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid identificationCard");
        });

        test("[400] identificationCard with more than 10 digits should fail", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ ...VALID_STUDENT_PAYLOAD, identificationCard: "12345678901" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid identificationCard");
        });

        test("[400] identificationCard with letters should fail", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register") // Ajustado a POST según tu consola
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...VALID_STUDENT_PAYLOAD,
                    identificationCard: "17ABCD7890" // Pisamos el valor válido con uno inválido
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("identificationCard");
        });

        test("[400] phoneNumber with invalid length should fail", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register") // Ajustado a POST según tu consola
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...VALID_STUDENT_PAYLOAD,
                    phoneNumber: "123" // Pisamos el valor válido con uno inválido
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("phoneNumber");
        });

        test("[400] phoneNumber with fewer than 10 digits should fail", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ ...VALID_STUDENT_PAYLOAD, phoneNumber: "098765432" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid phoneNumber");
        });

        test("[400] Invalid startDate (non-date string) should fail", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ ...VALID_STUDENT_PAYLOAD, startDate: "not-a-date" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid startDate");
        });

        test("[400] fullName shorter than 3 characters should fail", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ ...VALID_STUDENT_PAYLOAD, fullName: "AB" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid fullName");
        });

        test("[201] Valid payload creates a student with forced ACTIVE status and is_graduated=false", async () => {
            const newCi = "1111111111";
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...VALID_STUDENT_PAYLOAD,
                    identificationCard: newCi,
                    fullName: "Carlos Gomez Ruiz",
                    phoneNumber: "0911111111",
                    email: "carlos.gomez@test.com",
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Student registered successfully");

            // Verify business rules: contractStatus forced to ACTIVE, isGraduated false
            const data = res.body.data;
            expect(data.contractStatus).toBe("ACTIVE");
            expect(data.isGraduated).toBe(false);
        });

        test("[400] Duplicate identificationCard should return 'already exists' error", async () => {
            // The first student already has CI 1234567890 (VALID_STUDENT_PAYLOAD)
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(VALID_STUDENT_PAYLOAD);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("already exists");
        });
    });

    // ---------------------------------------------------------------- //
    // GET /api/students/search — Search students
    // ---------------------------------------------------------------- //
    describe("GET /api/students/search", () => {

        test("[200] Search by name should return matching students", async () => {
            const res = await request(testingStudentApp)
                .get("/api/students/search?q=Juan")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0].fullName).toContain("Juan");
        });

        test("[200] Search by identificationCard should return matching students", async () => {
            const res = await request(testingStudentApp)
                .get(`/api/students/search?q=${SECOND_STUDENT_CI}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0].identificationCard).toBe(SECOND_STUDENT_CI);
        });

        test("[200] Search with Maria should return the second student", async () => {
            const res = await request(testingStudentApp)
                .get("/api/students/search?q=Maria")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        test("[200] Search with no matching query should return empty array", async () => {
            const res = await request(testingStudentApp)
                .get("/api/students/search?q=ZZZNONEXISTENTSTUDENT999")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(0);
        });

        test("[200] Search with empty query should return all students", async () => {
            const res = await request(testingStudentApp)
                .get("/api/students/search")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(2);
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/students/:id — Partial update
    // ---------------------------------------------------------------- //
    describe("PATCH /api/students/:id", () => {

        test("[400] Malformed UUID should return 400 (VerifyUUID)", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${MALFORMED_ID}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ fullName: "Someone" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message.toLowerCase()).toContain("invalid item");
        });

        test("[400] Empty body should return 'No data provided to update'", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("No data provided to update");
        });

        test("[400] identificationCard with letters should fail on update", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ identificationCard: "17ABCD7890" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid identificationCard");
        });

        test("[400] phoneNumber with invalid length should fail on update", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ phoneNumber: "123" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid phoneNumber");
        });

        test("[200] Valid partial update (fullName only) should succeed", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ fullName: "Juan Pérez Updated" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Student updated successfully");
            expect(res.body.data.fullName).toBe("Juan Pérez Updated");
        });

        test("[200] Valid partial update (phoneNumber only) should succeed", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ phoneNumber: "0999999999" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.phoneNumber).toBe("0999999999");
        });

        test("[404] Update on non-existent UUID should return 'Student not found'", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${NON_EXISTENT_UUID}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ fullName: "Ghost Student" });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("Student not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/students/:id/contract-status — Change contract status
    // ---------------------------------------------------------------- //
    describe("PATCH /api/students/:id/contract-status", () => {

        test("[400] Malformed UUID should return 400 (VerifyUUID)", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${MALFORMED_ID}/contract-status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ contractStatus: "FROZEN" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message.toLowerCase()).toContain("invalid item");
        });

        test("[400] Missing contractStatus payload should fail", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}/contract-status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing contractStatus");
        });

        test("[400] Invalid contractStatus value should fail", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}/contract-status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ contractStatus: "UNKNOWN_STATUS" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Invalid contractStatus");
        });

        test("[200] Valid contractStatus 'FROZEN' should update correctly", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}/contract-status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ contractStatus: "FROZEN" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Student contract status changed successfully");
            expect(res.body.data.contractStatus).toBe("FROZEN");
        });

        test("[200] Restore contractStatus back to 'ACTIVE' should succeed", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}/contract-status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ contractStatus: "ACTIVE" });

            expect(res.status).toBe(200);
            expect(res.body.data.contractStatus).toBe("ACTIVE");
        });

        test("[404] contract-status on non-existent UUID should return 'Student not found'", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${NON_EXISTENT_UUID}/contract-status`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ contractStatus: "INACTIVE" });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("Student not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/students/:id/graduated — Toggle graduated status
    // ---------------------------------------------------------------- //
    describe("PATCH /api/students/:id/graduated", () => {

        test("[400] Malformed UUID should return 400 (VerifyUUID)", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${MALFORMED_ID}/graduated`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message.toLowerCase()).toContain("invalid item");
        });

        test("[200] Toggle graduated (false → true) should invert the boolean", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}/graduated`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Student graduated status toggled successfully");
            // Was false (injected in beforeAll), should now be true
            expect(res.body.data.isGraduated).toBe(true);
        });

        test("[200] Toggle graduated again (true → false) should invert back", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}/graduated`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.isGraduated).toBe(false);
        });

        test("[404] Toggle on non-existent UUID should return 'Student not found'", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${NON_EXISTENT_UUID}/graduated`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("Student not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/students/:id/deactivate — Deactivate student
    // ---------------------------------------------------------------- //
    describe("PATCH /api/students/:id/deactivate", () => {

        test("[400] Malformed UUID should return 400 (VerifyUUID)", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${MALFORMED_ID}/deactivate`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message.toLowerCase()).toContain("invalid item");
        });

        test("[404] Deactivate on non-existent UUID should return 'Student not found'", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${NON_EXISTENT_UUID}/deactivate`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("Student not found");
        });

        test("[200] Deactivate forces contractStatus to 'INACTIVE' (no body required)", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${secondStudentId}/deactivate`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Student deactivated successfully");
            expect(res.body.data.contractStatus).toBe("INACTIVE");
        });

        test("[200] Deactivating an already ACTIVE student forces contractStatus to 'INACTIVE'", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}/deactivate`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.contractStatus).toBe("INACTIVE");
        });
    });

    // ---------------------------------------------------------------- //
    // Authorization & Permissions (RBAC)
    // ---------------------------------------------------------------- //
    describe("Authorization & Permissions (RBAC)", () => {
        let teacherToken: string;

        beforeAll(async () => {
            const teacherUser = await User.create({
                us_full_name: "Teacher RBAC Tester",
                us_email: "teacher.students.rbac@test.com",
                us_password_hash: "MockHash123!",
                us_role: "TEACHER",
            });
            teacherToken = (await JwtAdapter.generateToken({
                id: teacherUser.us_id,
                email: teacherUser.us_email,
                role: teacherUser.us_role,
            })) as string;
        });

        test("[403] Should deny access to POST /api/students/register if user lacks ADMINDESK_STUDENTS_WRITE permission", async () => {
            const res = await request(testingStudentApp)
                .post("/api/students/register")
                .set("Authorization", `Bearer ${teacherToken}`)
                .send(VALID_STUDENT_PAYLOAD);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to PATCH /api/students/:id if user lacks ADMINDESK_STUDENTS_WRITE permission", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({ fullName: "Updated Name" });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to PATCH /api/students/:id/contract-status if user lacks ADMINDESK_STUDENTS_WRITE permission", async () => {
            const res = await request(testingStudentApp)
                .patch(`/api/students/${targetStudentId}/contract-status`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({ contractStatus: "FROZEN" });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });
    });
});