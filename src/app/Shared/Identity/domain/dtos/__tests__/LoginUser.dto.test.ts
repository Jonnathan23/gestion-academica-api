import { describe, test, expect } from "bun:test";
import { LoginUserDto } from "@/app/Shared/Identity/domain/dtos";

describe("LoginUserDto", () => {
    describe("create", () => {
        const validPayload = {
            us_email: "alice@example.com",
            us_password_hash: "StrongPass1",
        };

        // ------------------------------------------------------------------ //
        // Happy path
        // ------------------------------------------------------------------ //
        test("should return a LoginUserDto instance when all fields are valid", () => {
            const [error, dto] = LoginUserDto.create(validPayload);

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
            expect(dto).toBeInstanceOf(LoginUserDto);
            expect(dto!.us_email).toBe(validPayload.us_email);
            expect(dto!.us_password_hash).toBe(validPayload.us_password_hash);
        });

        // ------------------------------------------------------------------ //
        // Missing required fields
        // ------------------------------------------------------------------ //
        test("should return 'Missing email' when us_email is absent", () => {
            const [error, dto] = LoginUserDto.create({
                ...validPayload,
                us_email: undefined,
            });

            expect(error).toBe("Missing email");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing email' when us_email is an empty string", () => {
            const [error, dto] = LoginUserDto.create({
                ...validPayload,
                us_email: "",
            });

            expect(error).toBe("Missing email");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing password' when us_password_hash is absent", () => {
            const [error, dto] = LoginUserDto.create({
                ...validPayload,
                us_password_hash: undefined,
            });

            expect(error).toBe("Missing password");
            expect(dto).toBeUndefined();
        });

        test("should return 'Missing password' when us_password_hash is an empty string", () => {
            const [error, dto] = LoginUserDto.create({
                ...validPayload,
                us_password_hash: "",
            });

            expect(error).toBe("Missing password");
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
                "user @example.com",
            ];

            for (const invalidEmail of invalidEmails) {
                const [error, dto] = LoginUserDto.create({
                    ...validPayload,
                    us_email: invalidEmail,
                });

                expect(error).toBe("Invalid email");
                expect(dto).toBeUndefined();
            }
        });

        test("should return 'Invalid password' when the password is shorter than 6 characters", () => {
            const [error, dto] = LoginUserDto.create({
                ...validPayload,
                us_password_hash: "abc",
            });

            expect(error).toBe("Invalid password");
            expect(dto).toBeUndefined();
        });

        test("should return 'Invalid password' when the password has exactly 5 characters", () => {
            const [error, dto] = LoginUserDto.create({
                ...validPayload,
                us_password_hash: "12345",
            });

            expect(error).toBe("Invalid password");
            expect(dto).toBeUndefined();
        });

        test("should accept a password with exactly 6 characters as valid", () => {
            const [error, dto] = LoginUserDto.create({
                ...validPayload,
                us_password_hash: "abc123",
            });

            expect(error).toBeUndefined();
            expect(dto).toBeDefined();
        });
    });
});
