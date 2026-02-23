import { describe, test, expect, mock, beforeEach } from "bun:test";
import { UserRepositoryImpl } from "@/app/Shared/Identity/infrastructure/repositories/user.repository.impl";
import type { UserDataSource } from "@/app/Shared/Identity/domain/datasource/user.datasource";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";
import { RegisterUserDto, LoginUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //
const TARGET_USER_ID = "uuid-target-001";
const NEW_PASSWORD = "NewSecurePass1";

const buildUserEntity = (): UserEntity =>
    new UserEntity(
        TARGET_USER_ID,
        "John Doe",
        "john.doe@example.com",
        "hashed-password",
        "ADMIN",
        "true",
        new Date().toISOString(),
        new Date().toISOString(),
    );

const buildRegisterUserDto = (): RegisterUserDto => {
    const [error, dto] = RegisterUserDto.create({
        us_full_name: "John Doe",
        us_email: "john.doe@example.com",
        us_password_hash: "SecurePass1",
        us_role: "ADMIN",
    });
    if (error || !dto) throw new Error(`Test setup failed: ${error}`);
    return dto;
};

const buildLoginUserDto = (): LoginUserDto => {
    const [error, dto] = LoginUserDto.create({
        us_email: "john.doe@example.com",
        us_password_hash: "SecurePass1",
    });
    if (error || !dto) throw new Error(`Test setup failed: ${error}`);
    return dto;
};

const buildUpdateUserDto = (): UpdateUserDto => {
    const [error, dto] = UpdateUserDto.create({ us_full_name: "John Updated" });
    if (error || !dto) throw new Error(`Test setup failed: ${error}`);
    return dto;
};

// ------------------------------------------------------------------ //
// Mock DataSource factory
// ------------------------------------------------------------------ //
const buildMockUserDataSource = (): UserDataSource => ({
    create: mock(async (_dto) => buildUserEntity()),
    login: mock(async (_dto) => buildUserEntity()),
    update: mock(async (_id, _dto) => buildUserEntity()),
    changePassword: mock(async (_id, _password) => buildUserEntity()),
    changeStateActive: mock(async (_id) => buildUserEntity()),
    findById: mock(async (_id) => buildUserEntity()),
    findAll: mock(async () => [buildUserEntity()]),
});

// ------------------------------------------------------------------ //
// Tests
// ------------------------------------------------------------------ //
describe("UserRepositoryImpl", () => {
    let mockUserDataSource: UserDataSource;
    let userRepository: UserRepositoryImpl;

    beforeEach(() => {
        mockUserDataSource = buildMockUserDataSource();
        userRepository = new UserRepositoryImpl(mockUserDataSource);
    });

    // ---------------------------------------------------------------- //
    // create
    // ---------------------------------------------------------------- //
    describe("create", () => {
        test("should delegate to userDataSource.create with the correct RegisterUserDto", async () => {
            const registerUserDto = buildRegisterUserDto();

            await userRepository.create(registerUserDto);

            expect(mockUserDataSource.create).toHaveBeenCalledTimes(1);
            expect(mockUserDataSource.create).toHaveBeenCalledWith(registerUserDto);
        });

        test("should return the UserEntity resolved by the dataSource", async () => {
            const registerUserDto = buildRegisterUserDto();

            const result = await userRepository.create(registerUserDto);

            expect(result).toBeInstanceOf(UserEntity);
        });
    });

    // ---------------------------------------------------------------- //
    // login
    // ---------------------------------------------------------------- //
    describe("login", () => {
        test("should delegate to userDataSource.login with the correct LoginUserDto", async () => {
            const loginUserDto = buildLoginUserDto();

            await userRepository.login(loginUserDto);

            expect(mockUserDataSource.login).toHaveBeenCalledTimes(1);
            expect(mockUserDataSource.login).toHaveBeenCalledWith(loginUserDto);
        });

        test("should return the UserEntity resolved by the dataSource", async () => {
            const loginUserDto = buildLoginUserDto();

            const result = await userRepository.login(loginUserDto);

            expect(result).toBeInstanceOf(UserEntity);
        });
    });

    // ---------------------------------------------------------------- //
    // update
    // ---------------------------------------------------------------- //
    describe("update", () => {
        test("should delegate to userDataSource.update with the correct id and UpdateUserDto", async () => {
            const updateUserDto = buildUpdateUserDto();

            await userRepository.update(TARGET_USER_ID, updateUserDto);

            expect(mockUserDataSource.update).toHaveBeenCalledTimes(1);
            expect(mockUserDataSource.update).toHaveBeenCalledWith(TARGET_USER_ID, updateUserDto);
        });
    });

    // ---------------------------------------------------------------- //
    // changePassword
    // ---------------------------------------------------------------- //
    describe("changePassword", () => {
        test("should delegate to userDataSource.changePassword with the correct id and password", async () => {
            await userRepository.changePassword(TARGET_USER_ID, NEW_PASSWORD);

            expect(mockUserDataSource.changePassword).toHaveBeenCalledTimes(1);
            expect(mockUserDataSource.changePassword).toHaveBeenCalledWith(TARGET_USER_ID, NEW_PASSWORD);
        });
    });

    // ---------------------------------------------------------------- //
    // changeStateActive
    // ---------------------------------------------------------------- //
    describe("changeStateActive", () => {
        test("should delegate to userDataSource.changeStateActive with the correct id", async () => {
            await userRepository.changeStateActive(TARGET_USER_ID);

            expect(mockUserDataSource.changeStateActive).toHaveBeenCalledTimes(1);
            expect(mockUserDataSource.changeStateActive).toHaveBeenCalledWith(TARGET_USER_ID);
        });
    });

    // ---------------------------------------------------------------- //
    // findById
    // ---------------------------------------------------------------- //
    describe("findById", () => {
        test("should delegate to userDataSource.findById with the correct id", async () => {
            await userRepository.findById(TARGET_USER_ID);

            expect(mockUserDataSource.findById).toHaveBeenCalledTimes(1);
            expect(mockUserDataSource.findById).toHaveBeenCalledWith(TARGET_USER_ID);
        });

        test("should return the UserEntity resolved by the dataSource", async () => {
            const result = await userRepository.findById(TARGET_USER_ID);

            expect(result).toBeInstanceOf(UserEntity);
            expect(result.us_id).toBe(TARGET_USER_ID);
        });
    });

    // ---------------------------------------------------------------- //
    // findAll
    // ---------------------------------------------------------------- //
    describe("findAll", () => {
        test("should delegate to userDataSource.findAll with no arguments", async () => {
            await userRepository.findAll();

            expect(mockUserDataSource.findAll).toHaveBeenCalledTimes(1);
        });

        test("should return the array of UserEntity objects resolved by the dataSource", async () => {
            const result = await userRepository.findAll();

            expect(result).toBeInstanceOf(Array);
            expect(result[0]).toBeInstanceOf(UserEntity);
        });

        test("should return an empty array when the dataSource returns no users", async () => {
            (mockUserDataSource.findAll as ReturnType<typeof mock>).mockImplementation(async () => []);

            const result = await userRepository.findAll();

            expect(result).toEqual([]);
        });
    });

    // ---------------------------------------------------------------- //
    // Error propagation (spot-check on one method)
    // ---------------------------------------------------------------- //
    describe("error propagation", () => {
        test("should propagate an error thrown by the dataSource in create", async () => {
            const datasourceError = new Error("Database connection refused");
            (mockUserDataSource.create as ReturnType<typeof mock>).mockImplementation(
                async () => { throw datasourceError; }
            );

            await expect(userRepository.create(buildRegisterUserDto())).rejects.toThrow(
                "Database connection refused"
            );
        });
    });
});
