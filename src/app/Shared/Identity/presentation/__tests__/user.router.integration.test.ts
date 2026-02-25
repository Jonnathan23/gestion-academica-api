import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";

import { UserRouter } from "@/app/Shared/Identity/presentation/router";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { createGlobalErrorHandler } from "@/core/middleware";
import { SequelizeErrorHandler } from "@/data/errors/SequelizeErrorHandler";
import { testGlobalErrorHandler } from "@/__test__/configTest";

// ------------------------------------------------------------------ //
// Micro-application: real router + real error handler
// ------------------------------------------------------------------ //
const testingApp = express();
testingApp.use(express.json());
testingApp.use("/api/users", UserRouter.routes);
testingApp.use(testGlobalErrorHandler());

// ------------------------------------------------------------------ //
// Database: force-sync drops and recreates all tables before the suite
// ------------------------------------------------------------------ //
const testDatabase = new DatabaseConnection({
    databaseUrl: environmentVariables.databaseUrl,
    enableLogging: false,
    forceSynchronization: true,
});

// ------------------------------------------------------------------ //
// Payloads
// ------------------------------------------------------------------ //
const validAdminPayload = {
    us_full_name: "Integration Tester",
    us_email: "integration.tester@example.com",
    us_password_hash: "Str0ngP@ssw0rd!",
    us_role: "ADMIN",
};

// ------------------------------------------------------------------ //
// Test suite
// ------------------------------------------------------------------ //
describe("Integration Tests: User Router", () => {

    let targetUserId: string;

    beforeAll(async () => {
        await testDatabase.connect();
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    // ---------------------------------------------------------------- //
    // POST /api/users — Register user
    // ---------------------------------------------------------------- //
    describe("POST /api/users", () => {

        test("[400] Missing required fields should return first validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users")
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors[0].message).toContain("Missing");
        });

        test("[400] Invalid email format should return validation error", async () => {
            const res = await request(testingApp)
                .post("/api/users")
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
                .send(validAdminPayload);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("User created successfully");
        });

        test("[400] Duplicate email should return 'User already exists'", async () => {
            // The user from the previous test already exists in the DB
            const res = await request(testingApp)
                .post("/api/users")
                .send(validAdminPayload);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("User already exists");
        });
    });

    // ---------------------------------------------------------------- //
    // GET /api/users — Find all
    // ---------------------------------------------------------------- //
    describe("GET /api/users", () => {

        test("[200] Should return a non-empty list of users", async () => {
            const res = await request(testingApp).get("/api/users");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);

            // Capture the ID of the first user for subsequent test suites
            targetUserId = res.body.data[0].us_id;
            expect(typeof targetUserId).toBe("string");
        });
    });

    // ---------------------------------------------------------------- //
    // GET /api/users/:id — Find by ID
    // ---------------------------------------------------------------- //
    describe("GET /api/users/:id", () => {

        test("[200] Should return the user matching the given ID", async () => {
            const res = await request(testingApp).get(`/api/users/${targetUserId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.us_id).toBe(targetUserId);
            expect(res.body.data.us_email).toBe(validAdminPayload.us_email);
        });

        test("[404] Non-existent UUID should return 'User not found'", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000";
            const res = await request(testingApp).get(`/api/users/${fakeId}`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/users/:id — Update
    // ---------------------------------------------------------------- //
    describe("PATCH /api/users/:id", () => {

        test("[400] No updatable fields should return 'No fields to update'", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${targetUserId}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("No fields to update");
        });

        test("[400] Invalid email format in update should return validation error", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${targetUserId}`)
                .send({ us_email: "not-valid" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Invalid email");
        });

        test("[400] Invalid role in update should return validation error", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${targetUserId}`)
                .send({ us_role: "GHOST" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Invalid role");
        });

        test("[200] Partial update (name only) should succeed", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${targetUserId}`)
                .send({ us_full_name: "Updated Name" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("User updated successfully");
        });

        test("[404] Update on non-existent user should return 'User not found'", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000";
            const res = await request(testingApp)
                .patch(`/api/users/${fakeId}`)
                .send({ us_full_name: "Ghost User" });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/users/:id/state — Toggle active state
    // ---------------------------------------------------------------- //
    describe("PATCH /api/users/:id/state", () => {

        test("[200] Should toggle us_is_active and return success", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${targetUserId}/state`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("State changed successfully");
        });

        test("[404] Toggle on non-existent user should return 'User not found'", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000";
            const res = await request(testingApp)
                .patch(`/api/users/${fakeId}/state`);

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });
    });

    // ---------------------------------------------------------------- //
    // PATCH /api/users/:id/password — Change password
    // ---------------------------------------------------------------- //
    describe("PATCH /api/users/:id/password", () => {

        test("[400] Missing 'password' field should return validation error", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${targetUserId}/password`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Password is required");
        });

        test("[400] Password shorter than 6 characters should return validation error", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${targetUserId}/password`)
                .send({ password: "abc" });

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toBe("Password must be at least 6 characters long");
        });

        test("[200] Valid 'password' field should change the password successfully", async () => {
            const res = await request(testingApp)
                .patch(`/api/users/${targetUserId}/password`)
                .send({ password: "NewStr0ng123!" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Password changed successfully");
        });

        test("[404] Password change on non-existent user should return 'User not found'", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000";
            const res = await request(testingApp)
                .patch(`/api/users/${fakeId}/password`)
                .send({ password: "NewStr0ng123!" });

            expect(res.status).toBe(404);
            expect(res.body.errors[0].message).toBe("User not found");
        });
    });
});