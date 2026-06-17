import { describe, test, expect, beforeAll } from "bun:test";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";

import { VerifyRouter } from "@/app/shared/verify/presentation/verify.router";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { AuthMiddleware } from "@/core/middleware";
import { JwtAdapter } from "@/core/utils";
import { clientRoles, userRoles } from "@/core/interfaces/Roles.interfaces";

// ------------------------------------------------------------------ //
// Micro-application: only the Verify router
// ------------------------------------------------------------------ //
const testingApp = express();
testingApp.use(express.json());
testingApp.use(cookieParser()); // Ensure cookie parser is mounted for student sessions
testingApp.use("/api/verify", VerifyRouter.routes);
testingApp.use(testGlobalErrorHandler());

describe("Integration Tests: Verify Router", () => {
    let validUserToken: string;
    let validStudentToken: string;

    beforeAll(async () => {
        // Configure AuthMiddleware to blindly accept the user as active for this isolated test
        AuthMiddleware.configure(async (_userId: string) => {
            return true;
        });

        // Generate standard user token
        validUserToken = (await JwtAdapter.generateToken({
            id: "550e8400-e29b-41d4-a716-446655440000",
            email: "test.teacher@test.com",
            role: userRoles.TEACHER,
        })) as string;

        // Generate ephemeral student token
        validStudentToken = (await JwtAdapter.generateStudentToken({
            id: "550e8400-e29b-41d4-a716-446655440001",
            sessionId: "550e8400-e29b-41d4-a716-446655440002",
            role: clientRoles.STUDENT,
        })) as string;
    });

    // ---------------------------------------------------------------- //
    // GET /api/verify/user
    // ---------------------------------------------------------------- //
    describe("GET /api/verify/user", () => {
        test("[401] Without token should fail", async () => {
            const res = await request(testingApp).get("/api/verify/user");

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toContain("You must be logged in");
        });

        test("[401] With invalid token should fail", async () => {
            const res = await request(testingApp).get("/api/verify/user").set("Authorization", "Bearer invalid-token");

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toContain("Invalid or your session has expired");
        });

        test("[200] With valid token should return user session", async () => {
            const res = await request(testingApp).get("/api/verify/user").set("Authorization", `Bearer ${validUserToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Valid user session");
            expect(res.body.data.role).toBe(userRoles.TEACHER);
        });
    });

    // ---------------------------------------------------------------- //
    // GET /api/verify/student
    // ---------------------------------------------------------------- //
    describe("GET /api/verify/student", () => {
        test("[401] Without token should fail", async () => {
            const res = await request(testingApp).get("/api/verify/student");

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toContain("You must have an active student session");
        });

        test("[401] With invalid token should fail", async () => {
            const res = await request(testingApp).get("/api/verify/student").set("Cookie", [`classTrackSession=invalid-token`]);

            expect(res.status).toBe(401);
            expect(res.body.errors[0].message).toContain("Invalid or expired student session");
        });

        test("[200] With valid token should return student session", async () => {
            const res = await request(testingApp)
                .get("/api/verify/student")
                .set("Cookie", [`classTrackSession=${validStudentToken}`]);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Valid student session");
            expect(res.body.data.role).toBe(clientRoles.STUDENT);
        });
    });
});
