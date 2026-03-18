import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";

import { UserRouter } from "@/app/Shared/Identity/presentation/router";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { User } from "@/data/models/Shared";
import { JwtAdapter, BcryptAdapter } from "@/core/utils";

// ------------------------------------------------------------------ //
// Micro-application: real router + real error handler
// ------------------------------------------------------------------ //
const testingApp = express();
testingApp.use(express.json());
testingApp.use("/api/users", UserRouter.routes);
testingApp.use(testGlobalErrorHandler());

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
const SUPER_ADMIN_EMAIL = "super.admin@test.com";
const SUPER_ADMIN_PASSWORD = "SuperAdminPass1!";

const NEW_USER_PAYLOAD = {
    us_full_name: "New Integration User",
    us_email: "new.user@integration.com",
    us_password_hash: "Str0ngP@ssw0rd!",
    us_role: "ADMIN",
};

const NON_EXISTENT_UUID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const MALFORMED_ID = "not-a-valid-uuid";

// ------------------------------------------------------------------ //
// Test suite
// ------------------------------------------------------------------ //
describe("Integration Tests: User Router (Authenticated)", () => {

    let adminToken: string;
    let superAdminId: string;
    let createdUserId: string;

    beforeAll(async () => {
        await testDatabase.connect();

        // Inject a SuperAdmin directly via Sequelize
        const hashedPassword = await BcryptAdapter.hash(SUPER_ADMIN_PASSWORD);
        const superAdmin = await User.create({
            us_full_name: "Super Admin",
            us_email: SUPER_ADMIN_EMAIL,
            us_password_hash: hashedPassword,
            us_role: "ADMIN",
        });

        superAdminId = superAdmin.us_id;

        // Generate a valid JWT for all authenticated requests
        const token = await JwtAdapter.generateToken({
            id: superAdmin.us_id,
            email: superAdmin.us_email,
            role: superAdmin.us_role,
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

        test("[401] GET /api/users without token should return 'You must be logged in'", async () => {
            const res = await request(testingApp).get("/api/users");

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] GET /api/users with invalid token should return unauthorized", async () => {
            const res = await request(testingApp)
                .get("/api/users")
                .set("Authorization", "Bearer invalid.jwt.token");

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("errors");
        });

        test("[401] POST /api/users without token should be rejected", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .send(NEW_USER_PAYLOAD);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] PATCH /api/users/:id without token should be rejected", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${superAdminId}`)
                .send({ us_full_name: "Hacked Name" });

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You must be logged in");
        });

        test("[401] Authorization header without 'Bearer ' prefix should be rejected", async () => {
            const res = await request(testingApp)
                .get("/api/users")
                .set("Authorization", adminToken);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("You are not authorized");
        });
    });

    // ---------------------------------------------------------------- //
    // EDGE CASES — Invalid UUID in route params
    // ---------------------------------------------------------------- //
    describe("Edge Cases: Malformed UUID in :id param", () => {

        test("[400] GET /api/users/:id with malformed ID should return 400", async () => {
            const res = await request(testingApp)
                .get(`/api/users/${MALFORMED_ID}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
        });

        test("[400] PATCH /api/users/:id with malformed ID should return 400", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${MALFORMED_ID}`)
                .send({ us_full_name: "Nobody" })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
        });

        test("[400] POST /api/users/:id/state with numeric string ID should return 400", async () => {
            const res = await request(testingApp)
                .post("/api/users/12345/state")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
        });

        test("[400] PATCH /api/users/:id/password with malformed ID should return 400", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${MALFORMED_ID}/password`)
                .send({ password: "NewStr0ng123!" })
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
        });
    });

    // ---------------------------------------------------------------- //
    // POST /api/users — Register user
    // ---------------------------------------------------------------- //
    describe("POST /api/users", () => {

        test("[400] Missing required fields should return first validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors[0].message).toContain("Missing");
        });

        test("[400] Invalid email format should return validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    us_full_name: "John Doe",
                    us_email: "not-an-email",
                    us_password_hash: "Str0ngP@ssw0rd!",
                    us_role: "ADMIN",
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Invalid email");
        });

        test("[400] Weak password should return validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    us_full_name: "John Doe",
                    us_email: "john@example.com",
                    us_password_hash: "weak",
                    us_role: "ADMIN",
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Invalid password");
        });

        test("[400] Invalid role should return validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    us_full_name: "John Doe",
                    us_email: "john@example.com",
                    us_password_hash: "Str0ngP@ssw0rd!",
                    us_role: "SUPER_HACKER",
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Invalid role");
        });

        test("[201] Valid payload should register a new user", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(NEW_USER_PAYLOAD);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("User created successfully");
        });

        test("[400] Duplicate email should return 'User already exists'", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(NEW_USER_PAYLOAD);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("User already exists");
        });

        test("[400] Duplicate SuperAdmin email should also be rejected", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    ...NEW_USER_PAYLOAD,
                    us_email: SUPER_ADMIN_EMAIL,
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("User already exists");
        });
    });

    // ---------------------------------------------------------------- //
    // GET /api/users — Find all (Admin only)
    // ---------------------------------------------------------------- //
    describe("GET /api/users", () => {

        test("[200] Should return a non-empty list of users", async () => {
            const res = await request(testingApp)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            // SuperAdmin + new user = at least 2
            expect(res.body.data.length).toBeGreaterThanOrEqual(2);

            // Capture the non-admin user ID for subsequent tests
            const newUser = res.body.data.find(
                (u: { us_email: string }) => u.us_email === NEW_USER_PAYLOAD.us_email
            );
            createdUserId = newUser.us_id;
            expect(typeof createdUserId).toBe("string");
        });
    });

    // ---------------------------------------------------------------- //
    // GET /api/users/:id — Find by ID (Authenticated)
    // ---------------------------------------------------------------- //
    describe("GET /api/users/:id", () => {

        test("[200] Should return the user matching the given ID", async () => {
            const res = await request(testingApp)
                .get(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.us_id).toBe(createdUserId);
            expect(res.body.data.us_email).toBe(NEW_USER_PAYLOAD.us_email);
        });

        test("[404] Non-existent UUID should return 'User not found'", async () => {
            const res = await request(testingApp)
                .get(`/api/users/${NON_EXISTENT_UUID}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/users/:id — Update (Admin only)
    // ---------------------------------------------------------------- //
    describe("PATCH /api/users/:id", () => {

        test("[400] No updatable fields should return 'No fields to update'", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("No fields to update");
        });

        test("[400] Invalid email format in update should return validation error", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ us_email: "not-valid" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Invalid email");
        });

        test("[400] Invalid role in update should return validation error", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ us_role: "GHOST" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Invalid role");
        });

        test("[200] Partial update (name only) should succeed", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ us_full_name: "Updated Integration Name" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("User updated successfully");
        });

        test("[404] Update on non-existent user should return 'User not found'", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${NON_EXISTENT_UUID}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ us_full_name: "Ghost User" });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });
    });

    // ---------------------------------------------------------------- //
    // POST /api/users/:id/state — Toggle active state (Admin only)
    // ---------------------------------------------------------------- //
    describe("POST /api/users/:id/state", () => {

        test("[200] Should toggle us_is_active and return success", async () => {
            const res = await request(testingApp)
                .post(`/api/users/${createdUserId}/state`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("State changed successfully");
        });

        test("[404] Toggle on non-existent user should return 'User not found'", async () => {
            const res = await request(testingApp)
                .post(`/api/users/${NON_EXISTENT_UUID}/state`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/users/:id/password — Change password (Authenticated)
    // ---------------------------------------------------------------- //
    describe("PATCH /api/users/:id/password", () => {

        test("[400] Missing 'password' field should return validation error", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${createdUserId}/password`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Password is required");
        });

        test("[400] Password shorter than 6 characters should return validation error", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${createdUserId}/password`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ password: "abc" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Password must be at least 6 characters long");
        });

        test("[200] Valid 'password' field should change the password successfully", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${createdUserId}/password`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ password: "NewStr0ng123!" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Password changed successfully");
        });

        test("[404] Password change on non-existent user should return 'User not found'", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${NON_EXISTENT_UUID}/password`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ password: "NewStr0ng123!" });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });
    });

    // ---------------------------------------------------------------- //
    // POST /api/users/login — Login (Public endpoint, no token needed)
    // ---------------------------------------------------------------- //
    describe("POST /api/users/login", () => {

        test("[400] Missing email should return validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users/login")
                .send({ us_password_hash: SUPER_ADMIN_PASSWORD });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Missing email");
        });

        test("[400] Missing password should return validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users/login")
                .send({ us_email: SUPER_ADMIN_EMAIL });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Missing password");
        });

        test("[400] Empty body should return first validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users/login")
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors[0].message).toContain("Missing");
        });

        test("[400] Invalid email format should return validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users/login")
                .send({
                    us_email: "not-a-valid-email",
                    us_password_hash: SUPER_ADMIN_PASSWORD,
                });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Invalid email");
        });

        test("[404] Non-existent email should return 'User not found'", async () => {
            const res = await request(testingApp)
                .post("/api/users/login")
                .send({
                    us_email: "nobody@ghost.com",
                    us_password_hash: "SomeP@ssw0rd1!",
                });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });

        test("[401] Wrong password should return 'Invalid credentials'", async () => {
            const res = await request(testingApp)
                .post("/api/users/login")
                .send({
                    us_email: SUPER_ADMIN_EMAIL,
                    us_password_hash: "WrongP@ssw0rd1!",
                });

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toBe("Invalid credentials");
        });

        test("[200] Valid credentials should return token and user data", async () => {
            const res = await request(testingApp)
                .post("/api/users/login")
                .send({
                    us_email: SUPER_ADMIN_EMAIL,
                    us_password_hash: SUPER_ADMIN_PASSWORD,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("User logged in successfully");

            // Verify the response data contains user info and token
            const loginData = res.body.data;
            expect(loginData).toHaveProperty("token");
            expect(typeof loginData.token).toBe("string");
            expect(loginData.token.split(".")).toHaveLength(3);

            expect(loginData).toHaveProperty("user");
            expect(loginData.user.us_email).toBe(SUPER_ADMIN_EMAIL);
            expect(loginData.user.us_full_name).toBe("Super Admin");
            expect(loginData.user.us_role).toBe("ADMIN");
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
                us_email: "teacher.users.rbac@test.com",
                us_password_hash: "MockHash123!",
                us_role: "TEACHER",
            });
            teacherToken = (await JwtAdapter.generateToken({
                id: teacherUser.us_id,
                email: teacherUser.us_email,
                role: teacherUser.us_role,
            })) as string;
        });

        test("[403] Should deny access to POST /api/users if user lacks SHARED_IDENTITY_WRITE permission", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({ ...NEW_USER_PAYLOAD, us_email: "rbac.test@test.com" });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to GET /api/users if user lacks SHARED_IDENTITY_READ permission", async () => {
            const res = await request(testingApp)
                .get("/api/users")
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });

        test("[403] Should deny access to PATCH /api/users/:id if user lacks SHARED_IDENTITY_WRITE permission", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${teacherToken}`)
                .send({ us_full_name: "Forbidden Update" });

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });
        
        test("[403] Should deny access to POST /api/users/:id/state if user lacks SHARED_IDENTITY_WRITE permission", async () => {
            const res = await request(testingApp)
                .post(`/api/users/${createdUserId}/state`)
                .set("Authorization", `Bearer ${teacherToken}`);

            expect(res.status).toBe(403);
            expect(res.body.errors[0].message).toContain("Access denied");
        });
    });
});