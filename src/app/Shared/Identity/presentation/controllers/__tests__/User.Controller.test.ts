import { describe, test, expect, mock, spyOn, beforeEach, afterEach } from "bun:test";
import type { Request, Response, NextFunction } from "express";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { UserController } from "@/app/Shared/Identity/presentation/controllers/User.Controller";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";
import { CustomError } from "@/core/error";
import { SuccessResponse } from "@/core/utils";

// ------------------------------------------------------------------ //
// Shared fixtures
// ------------------------------------------------------------------ //
const MOCK_DATE = new Date().toISOString();

const buildUserEntity = (): UserEntity =>
    new UserEntity(
        "uuid-001",
        "John Doe",
        "john.doe@example.com",
        "hashed-password",
        "ADMIN",
        "true",
        MOCK_DATE,
        MOCK_DATE,
    );

// ------------------------------------------------------------------ //
// Global mock: use case classes
// Each class constructor returns an instance whose execute method is
// a jest-compatible mock so we can control return values per-test.
// ------------------------------------------------------------------ //
const executeRegisterMock = mock(async () => { });
const executeUpdateMock = mock(async () => { });
const executeChangePasswordMock = mock(async () => { });
const executeChangeStateActiveMock = mock(async () => { });
const executeFindByIdMock = mock(async () => buildUserEntity());
const executeFindAllMock = mock(async () => [buildUserEntity()]);

mock.module("@/app/Shared/Identity/application", () => ({
    RegisterUser: class {
        execute = executeRegisterMock;
    },
    UpdateUser: class {
        execute = executeUpdateMock;
    },
    ChangePassword: class {
        execute = executeChangePasswordMock;
    },
    ChangeStateActive: class {
        execute = executeChangeStateActiveMock;
    },
    FindUserById: class {
        execute = executeFindByIdMock;
    },
    FindAllUsers: class {
        execute = executeFindAllMock;
    },
}));

// ------------------------------------------------------------------ //
// Factory helpers for Express mocks
// ------------------------------------------------------------------ //
const buildResponseMock = (): Response =>
    ({
        status: mock().mockReturnThis(),
        json: mock(),
    }) as unknown as Response;

const buildNextMock = (): NextFunction => mock() as unknown as NextFunction;

const buildMockUserRepository = (): UserRepository => ({
    create: mock(async () => buildUserEntity()),
    login: mock(async () => buildUserEntity()),
    update: mock(async () => buildUserEntity()),
    changePassword: mock(async () => buildUserEntity()),
    changeStateActive: mock(async () => buildUserEntity()),
    findById: mock(async () => buildUserEntity()),
    findAll: mock(async () => [buildUserEntity()]),
});

// ------------------------------------------------------------------ //
// Tests
// ------------------------------------------------------------------ //
describe("UserController", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let mockRepo: UserRepository;
    let controller: UserController;
    let successCreatedSpy: ReturnType<typeof spyOn>;
    let successOkSpy: ReturnType<typeof spyOn>;

    beforeEach(() => {
        executeRegisterMock.mockReset();
        executeUpdateMock.mockReset();
        executeChangePasswordMock.mockReset();
        executeChangeStateActiveMock.mockReset();
        executeFindByIdMock.mockReset();
        executeFindAllMock.mockReset();

        // Restore default resolved implementations after reset
        executeRegisterMock.mockImplementation(async () => { });
        executeUpdateMock.mockImplementation(async () => { });
        executeChangePasswordMock.mockImplementation(async () => { });
        executeChangeStateActiveMock.mockImplementation(async () => { });
        executeFindByIdMock.mockImplementation(async () => buildUserEntity());
        executeFindAllMock.mockImplementation(async () => [buildUserEntity()]);

        // Spy on SuccessResponse without replacing Validators or other exports
        successCreatedSpy = spyOn(SuccessResponse, "created").mockImplementation(() => { });
        successOkSpy = spyOn(SuccessResponse, "ok").mockImplementation(() => { });

        res = buildResponseMock();
        next = buildNextMock();
        mockRepo = buildMockUserRepository();
        controller = new UserController(mockRepo);
    });

    afterEach(() => {
        successCreatedSpy.mockRestore();
        successOkSpy.mockRestore();
    });

    // ---------------------------------------------------------------- //
    // registerUser
    // ---------------------------------------------------------------- //
    describe("registerUser", () => {
        test("should call SuccessResponse.created when the DTO is valid and the use case resolves", async () => {
            req = {
                body: {
                    us_full_name: "John Doe",
                    us_email: "john.doe@example.com",
                    us_password_hash: "SecurePass1",
                    us_role: "ADMIN",
                },
            } as Request;

            controller.registerUser(req, res, next);

            // Allow the async chain to settle
            await new Promise(resolve => setTimeout(resolve, 20));

            expect(successCreatedSpy).toHaveBeenCalledWith(res, "User created successfully");
        });

        test("should throw CustomError.badRequest when the DTO validation fails", () => {
            req = { body: {} } as Request;

            expect(() => controller.registerUser(req, res, next)).toThrow();
        });

        test("should call next(error) when the use case rejects", async () => {
            const useCaseError = CustomError.internalServer("DB failure");
            executeRegisterMock.mockImplementation(async () => { throw useCaseError; });

            req = {
                body: {
                    us_full_name: "John Doe",
                    us_email: "john.doe@example.com",
                    us_password_hash: "SecurePass1",
                    us_role: "ADMIN",
                },
            } as Request;

            controller.registerUser(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(next).toHaveBeenCalledWith(useCaseError);
            expect(successCreatedSpy).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // update
    // ---------------------------------------------------------------- //
    describe("update", () => {
        test("should call SuccessResponse.ok when id is present and DTO is valid", async () => {
            req = {
                params: { id: "uuid-001" },
                body: { us_full_name: "Jane Doe" },
            } as unknown as Request;

            controller.update(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(successOkSpy).toHaveBeenCalledWith(res, "User updated successfully");
        });

        test("should throw CustomError.badRequest when id is missing", () => {
            req = {
                params: {},
                body: { us_full_name: "Jane Doe" },
            } as unknown as Request;

            expect(() => controller.update(req, res, next)).toThrow();
        });

        test("should throw CustomError.badRequest when the DTO has no valid fields", () => {
            req = {
                params: { id: "uuid-001" },
                body: {},
            } as unknown as Request;

            expect(() => controller.update(req, res, next)).toThrow();
        });

        test("should call next(error) when the use case rejects", async () => {
            const useCaseError = CustomError.notFound("User not found");
            executeUpdateMock.mockImplementation(async () => { throw useCaseError; });

            req = {
                params: { id: "uuid-001" },
                body: { us_full_name: "Jane Doe" },
            } as unknown as Request;

            controller.update(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(next).toHaveBeenCalledWith(useCaseError);
            expect(successOkSpy).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // changePassword
    // ---------------------------------------------------------------- //
    describe("changePassword", () => {
        test("should call SuccessResponse.ok when id and valid password are provided", async () => {
            req = {
                params: { id: "uuid-001" },
                body: { password: "NewPass123" },
            } as unknown as Request;

            controller.changePassword(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(successOkSpy).toHaveBeenCalledWith(res, "Password changed successfully");
        });

        test("should throw CustomError.badRequest when id is missing", () => {
            req = {
                params: {},
                body: { password: "NewPass123" },
            } as unknown as Request;

            expect(() => controller.changePassword(req, res, next)).toThrow();
        });

        test("should throw CustomError.badRequest when password is missing", () => {
            req = {
                params: { id: "uuid-001" },
                body: {},
            } as unknown as Request;

            expect(() => controller.changePassword(req, res, next)).toThrow();
        });

        test("should throw CustomError.badRequest when password is shorter than 6 characters", () => {
            req = {
                params: { id: "uuid-001" },
                body: { password: "abc" },
            } as unknown as Request;

            expect(() => controller.changePassword(req, res, next)).toThrow();
        });

        test("should call next(error) when the use case rejects", async () => {
            const useCaseError = CustomError.notFound("User not found");
            executeChangePasswordMock.mockImplementation(async () => { throw useCaseError; });

            req = {
                params: { id: "uuid-001" },
                body: { password: "NewPass123" },
            } as unknown as Request;

            controller.changePassword(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(next).toHaveBeenCalledWith(useCaseError);
            expect(successOkSpy).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // changeStateActive
    // ---------------------------------------------------------------- //
    describe("changeStateActive", () => {
        test("should call SuccessResponse.ok when id is present", async () => {
            req = {
                params: { id: "uuid-001" },
            } as unknown as Request;

            controller.changeStateActive(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(successOkSpy).toHaveBeenCalledWith(res, "State changed successfully");
        });

        test("should throw CustomError.badRequest when id is missing", () => {
            req = {
                params: {},
            } as unknown as Request;

            expect(() => controller.changeStateActive(req, res, next)).toThrow();
        });

        test("should call next(error) when the use case rejects", async () => {
            const useCaseError = CustomError.notFound("User not found");
            executeChangeStateActiveMock.mockImplementation(async () => { throw useCaseError; });

            req = {
                params: { id: "uuid-001" },
            } as unknown as Request;

            controller.changeStateActive(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(next).toHaveBeenCalledWith(useCaseError);
            expect(successOkSpy).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // findById
    // ---------------------------------------------------------------- //
    describe("findById", () => {
        test("should call SuccessResponse.ok with the user entity when id is present", async () => {
            const user = buildUserEntity();
            executeFindByIdMock.mockImplementation(async () => user);

            req = {
                params: { id: "uuid-001" },
            } as unknown as Request;

            controller.findById(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(successOkSpy).toHaveBeenCalledWith(res, "User found successfully", user);
        });

        test("should throw CustomError.badRequest when id is missing", () => {
            req = {
                params: {},
            } as unknown as Request;

            expect(() => controller.findById(req, res, next)).toThrow();
        });

        test("should call next(error) when the use case rejects", async () => {
            const useCaseError = CustomError.notFound("User not found");
            executeFindByIdMock.mockImplementation(async () => { throw useCaseError; });

            req = {
                params: { id: "uuid-999" },
            } as unknown as Request;

            controller.findById(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(next).toHaveBeenCalledWith(useCaseError);
            expect(successOkSpy).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // findAll
    // ---------------------------------------------------------------- //
    describe("findAll", () => {
        test("should call SuccessResponse.ok with the array of user entities", async () => {
            const users = [buildUserEntity(), buildUserEntity()];
            executeFindAllMock.mockImplementation(async () => users);

            req = {} as Request;

            controller.findAll(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(successOkSpy).toHaveBeenCalledWith(res, "Users found successfully", users);
        });

        test("should call next(error) when the use case rejects", async () => {
            const useCaseError = CustomError.internalServer("DB failure");
            executeFindAllMock.mockImplementation(async () => { throw useCaseError; });

            req = {} as Request;

            controller.findAll(req, res, next);

            await new Promise(resolve => setTimeout(resolve, 20));

            expect(next).toHaveBeenCalledWith(useCaseError);
            expect(successOkSpy).not.toHaveBeenCalled();
        });
    });
});
