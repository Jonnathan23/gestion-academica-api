import { describe, test, expect } from "bun:test";
import { UserMapper } from "@/app/Shared/Identity/infrastructure/mappers/user.mapper";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";
import { CustomError } from "@/core/error";

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //
const buildCompleteUserModel = () => ({
    us_id: "uuid-001",
    us_full_name: "John Doe",
    us_email: "john.doe@example.com",
    us_password_hash: "hashed-password-abc",
    us_role: "ADMIN",
    us_is_active: true,
    us_created_at: "2026-01-01T00:00:00.000Z",
    us_updated_at: "2026-01-02T00:00:00.000Z",
});

// ------------------------------------------------------------------ //
// Tests
// ------------------------------------------------------------------ //
describe("UserMapper", () => {
    describe("userModelToEntity", () => {
        // ---------------------------------------------------------- //
        // Happy path
        // ---------------------------------------------------------- //
        test("should map a complete user model object to a UserEntity instance", () => {
            const userModel = buildCompleteUserModel();

            const result = UserMapper.userModelToEntity(userModel);

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.us_id).toBe(userModel.us_id);
            expect(result.us_full_name).toBe(userModel.us_full_name);
            expect(result.us_email).toBe(userModel.us_email);
            expect(result.us_password_hash).toBe(userModel.us_password_hash);
            expect(result.us_role).toBe(userModel.us_role);
            expect(result.us_is_active).toBe(userModel.us_is_active);
            expect(result.us_created_at).toBe(userModel.us_created_at);
            expect(result.us_updated_at).toBe(userModel.us_updated_at);
        });

        test("should accept us_is_active as the boolean value false (falsy but defined)", () => {
            const userModel = { ...buildCompleteUserModel(), us_is_active: false };

            // us_is_active === undefined is the guard, so false should be accepted
            const result = UserMapper.userModelToEntity(userModel);

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.us_is_active).toBe(false);
        });

        // ---------------------------------------------------------- //
        // Error path — missing required fields
        // ---------------------------------------------------------- //
        const requiredStringFields: (keyof ReturnType<typeof buildCompleteUserModel>)[] = [
            "us_id",
            "us_full_name",
            "us_email",
            "us_password_hash",
            "us_role",
            "us_created_at",
            "us_updated_at",
        ];

        for (const fieldName of requiredStringFields) {
            test(`should throw a CustomError (500) when ${fieldName} is missing`, () => {
                const incompleteModel = { ...buildCompleteUserModel(), [fieldName]: undefined };

                expect(() => UserMapper.userModelToEntity(incompleteModel)).toThrow(CustomError);

                try {
                    UserMapper.userModelToEntity(incompleteModel);
                } catch (thrownError) {
                    expect(thrownError).toBeInstanceOf(CustomError);
                    expect((thrownError as CustomError).statusCode).toBe(500);
                    expect((thrownError as CustomError).message).toBe("Invalid user model");
                }
            });

            test(`should throw a CustomError (500) when ${fieldName} is an empty string`, () => {
                const incompleteModel = { ...buildCompleteUserModel(), [fieldName]: "" };

                expect(() => UserMapper.userModelToEntity(incompleteModel)).toThrow(CustomError);
            });
        }

        test("should throw a CustomError (500) when us_is_active is undefined", () => {
            const incompleteModel = { ...buildCompleteUserModel(), us_is_active: undefined };

            expect(() => UserMapper.userModelToEntity(incompleteModel)).toThrow(CustomError);

            try {
                UserMapper.userModelToEntity(incompleteModel);
            } catch (thrownError) {
                expect(thrownError).toBeInstanceOf(CustomError);
                expect((thrownError as CustomError).statusCode).toBe(500);
            }
        });

        test("should throw a CustomError (500) when the entire model object is empty", () => {
            expect(() => UserMapper.userModelToEntity({})).toThrow(CustomError);
        });
    });
});
