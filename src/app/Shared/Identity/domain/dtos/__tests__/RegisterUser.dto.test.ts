import { describe, test, expect } from "bun:test";
import { RegisterUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserRoles } from "@/app/Shared/Identity/domain/entities";

describe("RegisterUserDto", () => {
    describe("create", () => {
        const validPayload = {
            us_full_name: "John Doe",
            us_email: "john.doe@example.com",
            us_password_hash: "SecurePass123",
            us_role: "ADMIN" as UserRoles,
        };

        // ------------------------------------------------------------------ //
        // Happy path
        // ------------------------------------------------------------------ //
        test("should return a RegisterUserDto instance when all fields are valid", () => {
            const [error, dto] = RegisterUserDto.create(validPayload);

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
            expect(dto).toBeInstanceOf(RegisterUserDto);
            expect(dto!.us_full_name).toBe(validPayload.us_full_name);
            expect(dto!.us_email).toBe(validPayload.us_email);
            expect(dto!.us_password_hash).toBe(validPayload.us_password_hash);
            expect(dto!.us_role).toBe(validPayload.us_role);
        });

        test("should accept TEACHER as a valid role", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_role: "TEACHER",
            });

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
            expect(dto!.us_role).toBe("TEACHER");
        });

        // ------------------------------------------------------------------ //
        // Missing required fields
        // ------------------------------------------------------------------ //
        test("should return 'Missing name' when us_full_name is absent", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_full_name: undefined,
            });

            expect(error).toBe("Missing name");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing name' when us_full_name is an empty string", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_full_name: "",
            });

            expect(error).toBe("Missing name");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing email' when us_email is absent", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_email: undefined,
            });

            expect(error).toBe("Missing email");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing email' when us_email is an empty string", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_email: "",
            });

            expect(error).toBe("Missing email");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing password' when us_password_hash is absent", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_password_hash: undefined,
            });

            expect(error).toBe("Missing password");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing password' when us_password_hash is an empty string", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_password_hash: "",
            });

            expect(error).toBe("Missing password");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing role' when us_role is absent", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_role: undefined,
            });

            expect(error).toBe("Missing role");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing role' when us_role is an empty string", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_role: "",
            });

            expect(error).toBe("Missing role");
            expect(dto).toBeUndefined();
        });

        // ------------------------------------------------------------------ //
        // Format / value validation
        // ------------------------------------------------------------------ //
        test("should return 'Invalid email' when the email format is incorrect", () => {
            const invalidEmails = [
                "notAnEmail",
                "missing@tld",
                "@nodomain.com",
                "spaces in@email.com",
            ];

            for (const invalidEmail of invalidEmails) {
                const [error, dto] = RegisterUserDto.create({
                    ...validPayload,
                    us_email: invalidEmail,
                });

                expect(error).toBe("Invalid email");
                expect(dto).toBeUndefined();
            }
        });

        test("should return 'Invalid password' when the password is shorter than 6 characters", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_password_hash: "abc",
            });

            expect(error).toBe("Invalid password");
            expect(dto).toBeUndefined();
        });

        test("should return 'Invalid password' when the password has exactly 5 characters", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_password_hash: "abcde",
            });

            expect(error).toBe("Invalid password");
            expect(dto).toBeUndefined();
        });

        test("should accept a password with exactly 6 characters as valid", () => {
            const [error, dto] = RegisterUserDto.create({
                ...validPayload,
                us_password_hash: "abcdef",
            });

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
        });

        test("should return 'Invalid role' when the role is not a recognised value", () => {
            const invalidRoles = ["SUPERADMIN", "USER", "student", ""];

            for (const invalidRole of invalidRoles) {
                const [error, dto] = RegisterUserDto.create({
                    us_full_name: validPayload.us_full_name,
                    us_email: validPayload.us_email,
                    us_password_hash: validPayload.us_password_hash,
                    us_role: invalidRole,
                });

                // Empty-string role is caught by the "Missing role" guard first,
                // so we only assert "Invalid role" for genuinely non-empty bad roles.
                if (invalidRole !== "") {
                    expect(error).toBe("Invalid role");
                    expect(dto).toBeUndefined();
                }
            }
        });
    });
});
