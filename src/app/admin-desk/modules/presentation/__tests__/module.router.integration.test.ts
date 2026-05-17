import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";

import { ModulesRouter } from "@/app/admin-desk/modules/presentation/router";
import { environmentVariables } from "@/core/config";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { User } from "@/data/models/Shared";
import { JwtAdapter, BcryptAdapter } from "@/core/utils";
import { AuthMiddleware } from "@/core/middleware/auth.mid";

// ------------------------------------------------------------------ //
// Micro-application: only the Modules router (no User routes needed)
// ------------------------------------------------------------------ //
const testingModuleApp = express();
testingModuleApp.use(express.json());
testingModuleApp.use(cookieParser());
testingModuleApp.use("/api/modules", ModulesRouter.routes);
testingModuleApp.use(testGlobalErrorHandler());

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
const ADMIN_EMAIL = "admin.module.tester@test.com";
const ADMIN_PASSWORD = "AdminPass1!";

const VALID_MODULE_PAYLOAD = {
    mo_name: "A2",
    mo_description: "Module for intermediate learners",
    mo_level: 2,
};

const NON_EXISTENT_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const MALFORMED_ID = "not-a-uuid";

// ------------------------------------------------------------------ //
// Test suite
// ------------------------------------------------------------------ //
describe("Integration Tests: Module Router (Authenticated)", () => {

    let adminToken: string;
    let createdModuleId: string;

    beforeAll(async () => {
        await testDatabase.connect();

        AuthMiddleware.configure(async (userId: string) => {
            const user = await User.findByPk(userId);
            return user ? user.us_is_active : false;
        });

        // Inject an Admin user directly via Sequelize
        const hashedPassword = await BcryptAdapter.hash(ADMIN_PASSWORD);
        const adminUser = await User.create({
            us_full_name: "Admin Module Tester",
            us_email: ADMIN_EMAIL,
            us_password_hash: hashedPassword,
            us_role: "ADMIN",
        });

        // Generate a valid JWT
        const token = await JwtAdapter.generateToken({
            id: adminUser.us_id,
            email: adminUser.us_email,
            role: adminUser.us_role,
        });

        if (!token) throw new Error("Test setup failed: could not generate JWT");
        adminToken = token;
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    // ---------------------------------------------------------------- //
    // AUTH — [401] Unauthenticated access
    // ---------------------------------------------------------------- //
    describe("Authentication guard", () => {

        test("[401] GET /api/modules without token should return 'You must be logged in'", async () => {
            const res = await request(testingModuleApp).get("/api/modules");

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] POST /api/modules without token should be rejected", async () => {
            const res = await request(testingModuleApp)
                .post("/api/modules")
                .send(VALID_MODULE_PAYLOAD);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] PATCH /api/modules/:id without token should be rejected", async () => {
            const res = await request(testingModuleApp)
                .patch(`/api/modules/${NON_EXISTENT_UUID}`)
                .send({ mo_name: "Hacked" });

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] DELETE /api/modules/:id without token should be rejected", async () => {
            const res = await request(testingModuleApp)
                .delete(`/api/modules/${NON_EXISTENT_UUID}`);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] GET /api/modules with invalid token should return unauthorized", async () => {
            const res = await request(testingModuleApp)
                .get("/api/modules")
                .set("Authorization", "Bearer this.is.not.valid");

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("errors");
        });

        test("[401] Authorization header without 'Bearer ' prefix should be rejected", async () => {
            const res = await request(testingModuleApp)
                .get("/api/modules")
                .set("Authorization", adminToken);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] Active false user should return 'Your account has been deactivated...' and clear cookies", async () => {
            const deactivatedUser = await User.create({
                us_full_name: "Deactivated Module Tester",
                us_email: "deact.module@test.com",
                us_password_hash: "MockHash123!",
                us_role: "TEACHER",
                us_is_active: false
            });
            const deactivatedToken = await JwtAdapter.generateToken({
                id: deactivatedUser.us_id,
                email: deactivatedUser.us_email,
                role: deactivatedUser.us_role,
            });

            const res = await request(testingModuleApp)
                .get("/api/modules")
                .set("Cookie", [`auth_token=${deactivatedToken}`]);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("Your account has been deactivated by an administrator");
            const cookies = res.headers["set-cookie"];
            expect(cookies).toBeDefined();
            expect(cookies![0]).toContain("auth_token=;");
        });
    });

    // ---------------------------------------------------------------- //
    // POST /api/modules — Create module
    // ---------------------------------------------------------------- //
    describe("POST /api/modules", () => {

        test("[400] Missing 'mo_name' should return validation error", async () => {
            const res = await request(testingModuleApp)
                .post("/api/modules")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ mo_description: "Some description", mo_level: 2 });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing name");
        });

        test("[400] Missing 'mo_description' should return validation error", async () => {
            const res = await request(testingModuleApp)
                .post("/api/modules")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ mo_name: "B1", mo_level: 2 });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing description");
        });

        test("[400] Missing 'mo_level' should return validation error", async () => {
            const res = await request(testingModuleApp)
                .post("/api/modules")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ mo_name: "B1", mo_description: "Some description" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("Missing level");
        });

        test("[400] Empty body should return validation error", async () => {
            const res = await request(testingModuleApp)
                .post("/api/modules")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("errors");
        });

        test("[201] Valid payload should create a module successfully", async () => {
            const res = await request(testingModuleApp)
                .post("/api/modules")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(VALID_MODULE_PAYLOAD);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Module created successfully");
        });

        test("[400] Duplicate module name should return 'Module already exists'", async () => {
            const res = await request(testingModuleApp)
                .post("/api/modules")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(VALID_MODULE_PAYLOAD);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Module already exists");
        });
    });

    // ---------------------------------------------------------------- //
    // GET /api/modules — Get all modules
    // ---------------------------------------------------------------- //
    describe("GET /api/modules", () => {

        test("[200] Should return a non-empty list of modules", async () => {
            const res = await request(testingModuleApp)
                .get("/api/modules")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);

            // Capture the created module ID for subsequent tests
            createdModuleId = res.body.data[0].mo_id;
            expect(typeof createdModuleId).toBe("string");
        });
    });

    // ---------------------------------------------------------------- //
    // GET /api/modules/:id — Get module by ID
    // ---------------------------------------------------------------- //
    describe("GET /api/modules/:id", () => {

        test("[200] Should return the module matching the given ID", async () => {
            const res = await request(testingModuleApp)
                .get(`/api/modules/${createdModuleId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.mo_id).toBe(createdModuleId);
            expect(res.body.data.mo_name).toBe(VALID_MODULE_PAYLOAD.mo_name);
        });

        test("[404] Non-existent UUID should return 'Module not found'", async () => {
            const res = await request(testingModuleApp)
                .get(`/api/modules/${NON_EXISTENT_UUID}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("Module not found");
        });

        test("[400] Malformed ID should return 400 (VerifyUUID)", async () => {
            const res = await request(testingModuleApp)
                .get(`/api/modules/${MALFORMED_ID}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message.toLowerCase()).toContain("invalid item");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/modules/:id — Update module
    // ---------------------------------------------------------------- //
    describe("PATCH /api/modules/:id", () => {

        test("[400] Empty body should return 'Missing fields'", async () => {
            const res = await request(testingModuleApp)
                .patch(`/api/modules/${createdModuleId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Missing fields");
        });

        test("[200] Partial update (name only) should succeed", async () => {
            const res = await request(testingModuleApp)
                .patch(`/api/modules/${createdModuleId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ mo_name: "A2 Updated" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Module updated successfully");
        });

        test("[200] Partial update (description only) should succeed", async () => {
            const res = await request(testingModuleApp)
                .patch(`/api/modules/${createdModuleId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ mo_description: "Updated description for A2" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Module updated successfully");
        });

        test("[404] Update on non-existent module should return 'Module not found'", async () => {
            const res = await request(testingModuleApp)
                .patch(`/api/modules/${NON_EXISTENT_UUID}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ mo_name: "Ghost Module" });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("Module not found");
        });

        test("[400] Malformed ID should return 400 (VerifyUUID)", async () => {
            const res = await request(testingModuleApp)
                .patch(`/api/modules/${MALFORMED_ID}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ mo_name: "Fake Module" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message.toLowerCase()).toContain("invalid item");
        });
    });

    // ---------------------------------------------------------------- //
    // DELETE /api/modules/:id — Delete module
    // ---------------------------------------------------------------- //
    describe("DELETE /api/modules/:id", () => {

        test("[404] Delete on non-existent module should return 'Module not found'", async () => {
            const res = await request(testingModuleApp)
                .delete(`/api/modules/${NON_EXISTENT_UUID}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("Module not found");
        });

        test("[400] Malformed ID should return 400 (VerifyUUID)", async () => {
            const res = await request(testingModuleApp)
                .delete(`/api/modules/${MALFORMED_ID}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message.toLowerCase()).toContain("invalid item");
        });

        test("[200] Valid ID should delete the module successfully", async () => {
            const res = await request(testingModuleApp)
                .delete(`/api/modules/${createdModuleId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Module deleted successfully");
        });

        test("[404] Deleting the same module again should return 'Module not found'", async () => {
            const res = await request(testingModuleApp)
                .delete(`/api/modules/${createdModuleId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("Module not found");
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
                us_email: "teacher.modules.rbac@test.com",
                us_password_hash: "MockHash123!",
                us_role: "TEACHER",
            });
            teacherToken = (await JwtAdapter.generateToken({
                id: teacherUser.us_id,
                email: teacherUser.us_email,
                role: teacherUser.us_role,
            })) as string;
        });

        test("[403] Should deny access to POST /api/modules if user lacks ADMINDESK_MODULES_WRITE permission", async () => {
            const res = await request(testingModuleApp)
                .post("/api/modules")
                .set("Authorization", `Bearer ${teacherToken}`)
                .send(VALID_MODULE_PAYLOAD);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to PATCH /api/modules/:id if user lacks ADMINDESK_MODULES_WRITE permission", async () => {
            const res = await request(testingModuleApp)
                .patch(`/api/modules/${createdModuleId}`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({ mo_name: "Forbidden Update" });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to DELETE /api/modules/:id if user lacks ADMINDESK_MODULES_WRITE permission", async () => {
            const res = await request(testingModuleApp)
                .delete(`/api/modules/${createdModuleId}`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });
    });
});