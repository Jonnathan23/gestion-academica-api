import { describe, test, expect, beforeAll, afterAll, spyOn } from "bun:test";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";

import { ContractsRouter } from "@/app/admin-desk/student-level/presentation/student-level.router";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { userRoles } from "@/core/interfaces/Roles.interfaces";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { environmentVariables } from "@/core/config/envs";
import User from "@/data/models/shared/user.model";
import Student from "@/data/models/admin-desk/student.model";
import Module from "@/data/models/admin-desk/module.model";
import StudentModule from "@/data/models/admin-desk/student-module.model";
import { JwtAdapter } from "@/core/utils/adapters/jwt";
import { BcryptAdapter } from "@/core/utils/adapters/bcrypt";

// ------------------------------------------------------------------ //
// Micro-application: only the Contracts (Student Levels) router
// ------------------------------------------------------------------ //
const testingContractsApp = express();
testingContractsApp.use(express.json());
testingContractsApp.use(cookieParser());
testingContractsApp.use("/api/student-levels", ContractsRouter.routes);
testingContractsApp.use(testGlobalErrorHandler());

// ------------------------------------------------------------------ //
// Database: force-sync drops and recreates all tables
// ------------------------------------------------------------------ //
const testDatabase = new DatabaseConnection({
    databaseUrl: environmentVariables.databaseUrl,
    enableLogging: false,
    forceSynchronization: true,
});

// ------------------------------------------------------------------ //
// Shared constants
// ------------------------------------------------------------------ //
const ADMIN_EMAIL = "admin.contracts.tester@test.com";
const ADMIN_PASSWORD = "AdminPass1!";
const NON_EXISTENT_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const MALFORMED_ID = "not-a-uuid";

// ------------------------------------------------------------------ //
// Test suite
// ------------------------------------------------------------------ //
describe("Integration Tests: Student Levels Router (Contracts)", () => {
    let adminToken: string;
    let testStudentId: string;

    let moduleA1Id: string;
    let moduleA2Id: string;
    let moduleB1Id: string;

    let studentLevelA1Id: string;
    let studentLevelA2Id: string;

    beforeAll(async () => {
        await testDatabase.connect();

        AuthMiddleware.configure(async (userId: string) => {
            const user = await User.findByPk(userId);
            return user ? user.us_is_active : false;
        });

        // Inject an Admin user directly via Sequelize
        const hashedPassword = await BcryptAdapter.hash(ADMIN_PASSWORD);
        const adminUser = await User.create({
            us_full_name: "Admin Contracts Tester",
            us_email: ADMIN_EMAIL,
            us_password_hash: hashedPassword,
            us_role: userRoles.ADMIN,
        });

        // Generate a valid JWT
        const token = await JwtAdapter.generateToken({
            id: adminUser.us_id,
            email: adminUser.us_email,
            role: adminUser.us_role,
        });

        if (!token) throw new Error("Test setup failed: could not generate JWT");
        adminToken = token;

        // Crea un Student de prueba
        const testStudent = await Student.create({
            st_full_name: "John Test",
            st_identification_card: "0999999999",
            st_phone_number: "0999999999",
            st_email: "john.test@contracts.com",
            st_date_of_birth: new Date("1998-10-10"),
            st_nationality: "Ecuadorian",
            st_certificate_type: "OTHER",
            st_start_date: new Date("2024-01-01T00:00:00.000Z"),
            st_is_graduated: false,
            st_contract_status: "ACTIVE",
            st_progress_category: "NOT_ENOUGH_DATA",
        });
        testStudentId = testStudent.st_id;

        // Crea TRES Module de prueba con mo_name estricto
        const moduleA1 = await Module.create({ mo_name: "A1", mo_description: "Beginner Level", mo_level: 1 });
        const moduleA2 = await Module.create({ mo_name: "A2", mo_description: "Elementary Level", mo_level: 2 });
        const moduleB1 = await Module.create({ mo_name: "B1", mo_description: "Intermediate Level", mo_level: 3 });

        moduleA1Id = moduleA1.mo_id;
        moduleA2Id = moduleA2.mo_id;
        moduleB1Id = moduleB1.mo_id;
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    // ---------------------------------------------------------------- //
    // AUTH — [401] Unauthenticated access
    // ---------------------------------------------------------------- //
    describe("Authentication guard", () => {
        test("[401] Active false user should return 'Your account has been deactivated...' and clear cookies", async () => {
            const deactivatedUser = await User.create({
                us_full_name: "Deactivated Contracts Tester",
                us_email: "deact.contract@test.com",
                us_password_hash: "MockHash123!",
                us_role: "TEACHER",
                us_is_active: false,
            });
            const deactivatedToken = await JwtAdapter.generateToken({
                id: deactivatedUser.us_id,
                email: deactivatedUser.us_email,
                role: deactivatedUser.us_role,
            });

            const res = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Cookie", [`auth_token=${deactivatedToken}`])
                .send({ moduleIds: [moduleB1Id] });

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("Your account has been deactivated by an administrator");
            const cookies = res.headers["set-cookie"];
            expect(cookies).toBeDefined();
            expect(cookies![0]).toContain("auth_token=;");
        });
    });

    // ---------------------------------------------------------------- //
    // 1. Pruebas de Compra (POST /api/student-levels/student/:studentId)
    // ---------------------------------------------------------------- //
    describe("POST /api/student-levels/student/:studentId", () => {
        test("[400] Falla si el studentId o los moduleIds son invalidos, estan vacios o faltan", async () => {
            // Falla por moduleIds faltantes
            const resNoModules = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(resNoModules.status).toBe(400);

            // Falla por moduleIds vacios
            const resEmptyModules = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ moduleIds: [] });

            expect(resEmptyModules.status).toBe(400);

            // Falla por studentId invalido
            const resInvalidStudent = await request(testingContractsApp)
                .post(`/api/student-levels/student/${MALFORMED_ID}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ moduleIds: [moduleA1Id] });

            expect(resInvalidStudent.status).toBe(400);
        });

        test("[400] Falla si se envian UUIDs de modulos que no existen en la BD", async () => {
            const res = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ moduleIds: [NON_EXISTENT_UUID] });

            expect(res.status).toBe(400);
        });

        test("[400] Falla si el estudiante intenta adquirir módulos con un salto de nivel", async () => {
            // Estudiante no tiene módulos, por ende su primer nivel debe ser 1 (A1). Intenta comprar B1 (nivel 3).
            const res = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ moduleIds: [moduleB1Id] });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("El progreso de módulos es inválido");
        });

        test("[201] Compra exitosa de 'A1' y 'A2'. Verifica que el response devuelva A1 como ACTIVE y A2 como LOCKED", async () => {
            const res = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ moduleIds: [moduleA1Id, moduleA2Id] });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("data");

            const contractsData = res.body.data;
            expect(Array.isArray(contractsData)).toBe(true);

            // Buscar cada uno en la respuesta para verificar el estado
            const contractA1 = contractsData.find((contract: any) => contract.moduleId === moduleA1Id);
            const contractA2 = contractsData.find((contract: any) => contract.moduleId === moduleA2Id);

            expect(contractA1).toBeDefined();
            expect(contractA2).toBeDefined();

            expect(contractA1.status).toBe("ACTIVE");
            expect(contractA2.status).toBe("LOCKED");

            // Guardar sus IDs devueltos de la respuesta
            studentLevelA1Id = contractA1.id;
            studentLevelA2Id = contractA2.id;
        });

        test("[400] Falla si el estudiante intenta comprar un módulo que ya posee (ej: A1)", async () => {
            // El estudiante ya compró A1 y A2 en la prueba anterior
            const res = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ moduleIds: [moduleA1Id] });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("El estudiante ya posee el módulo de nivel 1");
        });

        test("[503] PRUEBA DE ATOMICIDAD (ROLLBACK): Falla forzada en BD y evita incremento", async () => {
            const bulkCreateSpy = spyOn(StudentModule, "bulkCreate").mockImplementation(() => {
                throw new Error("Forced DB Error");
            });

            const countBefore = await StudentModule.count();

            // Intento de compra con modulo restante
            const res = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ moduleIds: [moduleB1Id] });

            expect(res.status).toBe(503);

            const countAfter = await StudentModule.count();
            expect(countAfter).toBe(countBefore);

            bulkCreateSpy.mockRestore();
        });
    });

    // ---------------------------------------------------------------- //
    // 2. Pruebas de Cascada (PATCH /api/student-levels/:studentLevelId/status)
    // ---------------------------------------------------------------- //
    describe("PATCH /api/student-levels/:studentLevelId/status", () => {
        test("[400] Falla si los parametros son malformados", async () => {
            // Falla por malformed studentId
            const resNoStatus = await request(testingContractsApp)
                .patch(`/api/student-levels/${studentLevelA1Id}/status/finish-current/${MALFORMED_ID}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(resNoStatus.status).toBe(400);

            // Falla por malformed studentLevelId
            const resInvalidStatus = await request(testingContractsApp)
                .patch(`/api/student-levels/${MALFORMED_ID}/status/finish-current/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(resInvalidStatus.status).toBe(400);
        });

        test("[404] Falla si el ID del nivel no existe en la BD", async () => {
            const res = await request(testingContractsApp)
                .patch(`/api/student-levels/${NON_EXISTENT_UUID}/status/finish-current/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
        });

        test("[200] Actualiza el nivel 'A1' a estado APPROVED. Verifica que el response sea exitoso", async () => {
            const res = await request(testingContractsApp)
                .patch(`/api/student-levels/${studentLevelA1Id}/status/finish-current/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("[200] Haz un GET del estudiante y verifica que la auto-sanacion asigne A2 a ACTIVE", async () => {
            const res = await request(testingContractsApp)
                .get(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);

            const contractsData = res.body.data;
            const updatedA2 = contractsData.find((contract: any) => contract.id === studentLevelA2Id);

            expect(updatedA2).toBeDefined();
            expect(updatedA2.status).toBe("ACTIVE");
        });
    });

    // ---------------------------------------------------------------- //
    // 3. Pruebas de Auto-Sanacion (DELETE /api/student-levels/:studentLevelId)
    // ---------------------------------------------------------------- //
    describe("DELETE /api/student-levels/:studentLevelId", () => {
        test("[404] Falla si el UUID no existe", async () => {
            const res = await request(testingContractsApp)
                .delete(`/api/student-levels/${NON_EXISTENT_UUID}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
        });

        test("[200] Elimina el nivel 'A1'", async () => {
            const res = await request(testingContractsApp)
                .delete(`/api/student-levels/${studentLevelA1Id}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("[200] Haz un GET del estudiante y verifica que la auto-sanacion forzo a 'A2' a ser el nuevo ACTIVE", async () => {
            const res = await request(testingContractsApp)
                .get(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);

            const contractsData = res.body.data;
            const remainingA2 = contractsData.find((contract: any) => contract.id === studentLevelA2Id);

            expect(remainingA2).toBeDefined();
            expect(remainingA2.status).toBe("ACTIVE");
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
                us_email: "teacher.contracts.rbac@test.com",
                us_password_hash: "MockHash123!",
                us_role: userRoles.TEACHER,
            });
            teacherToken = (await JwtAdapter.generateToken({
                id: teacherUser.us_id,
                email: teacherUser.us_email,
                role: teacherUser.us_role,
            })) as string;
        });

        test("[403] Should deny access to POST /api/student-levels/student/:studentId if user lacks ADMINDESK_CONTRACTS_WRITE permission", async () => {
            const res = await request(testingContractsApp)
                .post(`/api/student-levels/student/${testStudentId}`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({ moduleIds: [moduleB1Id] });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to PATCH /api/student-levels/:studentLevelId/status/finish-current/:studentId if user lacks ADMINDESK_CONTRACTS_WRITE permission", async () => {
            const res = await request(testingContractsApp)
                .patch(`/api/student-levels/${studentLevelA1Id}/status/finish-current/${testStudentId}`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to DELETE /api/student-levels/:studentLevelId if user lacks ADMINDESK_CONTRACTS_WRITE permission", async () => {
            const res = await request(testingContractsApp)
                .delete(`/api/student-levels/${studentLevelA1Id}`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });
    });
});
