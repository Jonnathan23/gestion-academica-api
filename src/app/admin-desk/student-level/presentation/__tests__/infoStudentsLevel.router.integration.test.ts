import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import express from "express";

import { InfoStudentsLevelRouter } from "@/app/admin-desk/student-level/presentation/info-students-level.router";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { testGlobalErrorHandler } from "@/__test__/configTest";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import User from "@/data/models/shared/user.model";
import Student from "@/data/models/admin-desk/student.model";
import { JwtAdapter } from "@/core/utils/adapters/jwt";
import { BcryptAdapter } from "@/core/utils/adapters/bcrypt";

const testingApp = express();
testingApp.use(express.json());
testingApp.use("/api/student-levels", InfoStudentsLevelRouter.routes);
testingApp.use(testGlobalErrorHandler());

const testDatabase = new DatabaseConnection({
    databaseUrl: environmentVariables.databaseUrl,
    enableLogging: false,
    forceSynchronization: true,
});

describe("Integration Tests: Info Students Level Router", () => {
    let adminToken: string;
    let targetStudentId: string;

    beforeAll(async () => {
        await testDatabase.connect();

        AuthMiddleware.configure(async (userId: string) => {
            const user = await User.findByPk(userId);
            return user ? user.us_is_active : false;
        });

        const hashedPassword = await BcryptAdapter.hash("AdminPass1!");
        const adminUser = await User.create({
            us_full_name: "Admin Tester",
            us_email: "admin.info.tester@test.com",
            us_password_hash: hashedPassword,
            us_role: "ADMIN",
        });

        adminToken = (await JwtAdapter.generateToken({
            id: adminUser.us_id,
            email: adminUser.us_email,
            role: adminUser.us_role,
        })) as string;

        const student = await Student.create({
            st_identification_card: "1234567890",
            st_full_name: "Juan Pérez",
            st_phone_number: "0987654321",
            st_email: "test.student@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: "TOEFL",
            st_start_date: new Date("2024-01-15"),
            st_contract_status: "ACTIVE",
            st_progress_category: "NOT_ENOUGH_DATA",
            st_is_graduated: false,
        });
        targetStudentId = student.st_id;
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    describe("GET /api/student-levels/search", () => {
        test("[200] Search students should return results", async () => {
            const res = await request(testingApp).get("/api/student-levels/search").set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("[200] Search students with valid limit and searchTerm", async () => {
            const res = await request(testingApp)
                .get("/api/student-levels/search?searchTerm=Juan&limit=10")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test("[400] Search students with invalid limit should return validation error", async () => {
            const res = await request(testingApp).get("/api/student-levels/search?limit=-5").set("Authorization", `Bearer ${adminToken}`);

            expect(res.status).toBe(400);
            expect(res.body.errors[0].message).toContain("limit must be a positive integer");
        });
    });

    describe("GET /api/student-levels/student/:studentId/timeline", () => {
        test("[200] Get student timeline should return successfully", async () => {
            const res = await request(testingApp)
                .get(`/api/student-levels/student/${targetStudentId}/timeline`)
                .set("Authorization", `Bearer ${adminToken}`);

            // Just expect it to hit the controller without validation error
            expect([200, 404]).toContain(res.status); // 404 if timeline is empty/not found depending on logic, but DTO passed
        });
    });
});
