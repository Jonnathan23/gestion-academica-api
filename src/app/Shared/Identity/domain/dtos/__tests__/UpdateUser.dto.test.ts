import { describe, test, expect } from "bun:test";
import { UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserRoles } from "@/app/Shared/Identity/domain/entities";

describe("UpdateUserDto", () => {
    describe("create", () => {
        // ------------------------------------------------------------------ //
        // Happy path – single field updates
        // ------------------------------------------------------------------ //
        test("should return an UpdateUserDto instance when only us_full_name is provided", () => {
            const [error, dto] = UpdateUserDto.create({ us_full_name: "Jane Doe" });

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
            expect(dto).toBeInstanceOf(UpdateUserDto);
            expect(dto!.us_full_name).toBe("Jane Doe");
            expect(dto!.us_email).toBeUndefined();
            expect(dto!.us_role).toBeUndefined();
        });

        test("should return an UpdateUserDto instance when only us_email is provided and valid", () => {
            const [error, dto] = UpdateUserDto.create({
                us_email: "jane.doe@example.com",
            });

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
            expect(dto!.us_email).toBe("jane.doe@example.com");
        });

        test("should return an UpdateUserDto instance when only us_role is provided and valid", () => {
            const [error, dto] = UpdateUserDto.create({ us_role: "TEACHER" });

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
            expect(dto!.us_role).toBe("TEACHER");
        });

        test("should return an UpdateUserDto instance when all fields are provided and valid", () => {
            const payload = {
                us_full_name: "John Smith",
                us_email: "john.smith@example.com",
                us_role: "ADMIN" as UserRoles,
            };

            const [error, dto] = UpdateUserDto.create(payload);

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
            expect(dto!.us_full_name).toBe(payload.us_full_name);
            expect(dto!.us_email).toBe(payload.us_email);
            expect(dto!.us_role).toBe(payload.us_role);
        });

        // ------------------------------------------------------------------ //
        // Error – no fields present
        // ------------------------------------------------------------------ //
        test("should return 'No fields to update' when the payload is completely empty", () => {
            const [error, dto] = UpdateUserDto.create({});

            expect(error).toBe("No fields to update");
            expect(dto).toBeUndefined();
        });

        test("should return 'No fields to update' when all fields are explicitly undefined", () => {
            const [error, dto] = UpdateUserDto.create({
                us_full_name: undefined,
                us_email: undefined,
                us_role: undefined,
            });

            expect(error).toBe("No fields to update");
            expect(dto).toBeUndefined();
        });

        // ------------------------------------------------------------------ //
        // Email validation
        // ------------------------------------------------------------------ //
        test("should return 'Invalid email' when the email format is incorrect", () => {
            const invalidEmails = [
                "notAnEmail",
                "missing@tld",
                "@nodomain.com",
            ];

            for (const invalidEmail of invalidEmails) {
                const [error, dto] = UpdateUserDto.create({
                    us_email: invalidEmail,
                });

                expect(error).toBe("Invalid email");
                expect(dto).toBeUndefined();
            }
        });

        // ------------------------------------------------------------------ //
        // Role validation
        // ------------------------------------------------------------------ //
        test("should return 'Invalid role' when the role is not a recognised value", () => {
            const invalidRoles = ["SUPERADMIN", "USER", "student", "guest"];

            for (const invalidRole of invalidRoles) {
                const [error, dto] = UpdateUserDto.create({
                    us_full_name: "John",
                    us_role: invalidRole,
                });

                expect(error).toBe("Invalid role");
                expect(dto).toBeUndefined();
            }
        });

        // ------------------------------------------------------------------ //
        // values getter
        // ------------------------------------------------------------------ //
        test("values getter should only include defined fields", () => {
            const [, dto] = UpdateUserDto.create({
                us_full_name: "Alice",
                us_role: "ADMIN",
            });

            const values = dto!.values;

            expect(values).toHaveProperty("us_full_name", "Alice");
            expect(values).toHaveProperty("us_role", "ADMIN");
            expect(values).not.toHaveProperty("us_email");
        });

        test("values getter should return all three fields when all are set", () => {
            const [, dto] = UpdateUserDto.create({
                us_full_name: "Bob",
                us_email: "bob@example.com",
                us_role: "TEACHER",
            });

            const values = dto!.values;

            expect(Object.keys(values)).toHaveLength(3);
            expect(values.us_full_name).toBe("Bob");
            expect(values.us_email).toBe("bob@example.com");
            expect(values.us_role).toBe("TEACHER");
        });
    });
});
