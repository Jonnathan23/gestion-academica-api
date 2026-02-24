import { describe, test, expect, mock, beforeEach } from "bun:test";
import { UserDataSourceImpl } from "@/app/Shared/Identity/infrastructure/datasources/user.datasource.impl";
import { CustomError } from "@/core/error";
import { UserEntity, type UserRoles } from "@/app/Shared/Identity/domain/entities";
import { RegisterUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";

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

const buildValidRegisterUserDto = (): RegisterUserDto => {
    const [error, dto] = RegisterUserDto.create({
        us_full_name: "John Doe",
        us_email: "john.doe@example.com",
        us_password_hash: "SecurePass1",
        us_role: "ADMIN",
    });
    if (error || !dto) throw new Error(`Test setup failed: ${error}`);
    return dto;
};

// ------------------------------------------------------------------ //
// Sequelize User model stub
// The stub needs an `update` method on the instance for methods that call
// userExist.update(...)
// ------------------------------------------------------------------ //
const buildUserModelInstance = (overrides: Record<string, unknown> = {}) => ({
    us_id: "uuid-001",
    us_full_name: "John Doe",
    us_email: "john.doe@example.com",
    us_password_hash: "hashed-password",
    us_role: "ADMIN",
    us_is_active: true,
    us_created_at: MOCK_DATE,
    us_updated_at: MOCK_DATE,
    update: mock(async (_values: Record<string, unknown>) => { }),
    ...overrides,
});

// ------------------------------------------------------------------ //
// Global mock: replaces the Sequelize User model
// ------------------------------------------------------------------ //
const userFindOneMock = mock();
const userCreateMock = mock();
const userFindAllMock = mock();

mock.module("@/data/models/Shared", () => ({
    User: {
        findOne: userFindOneMock,
        create: userCreateMock,
        findAll: userFindAllMock,
    },
}));

// ------------------------------------------------------------------ //
// Constructor-injected mocks
// ------------------------------------------------------------------ //
const mockHashFunction = mock(async (_plain: string) => "hashed-password");
const mockUserEntityFromObject = mock((_obj: unknown) => buildUserEntity());

// ------------------------------------------------------------------ //
// Tests
// ------------------------------------------------------------------ //
describe("UserDataSourceImpl", () => {
    let dataSource: UserDataSourceImpl;

    beforeEach(() => {
        userFindOneMock.mockReset();
        userCreateMock.mockReset();
        userFindAllMock.mockReset();
        mockHashFunction.mockReset();
        mockUserEntityFromObject.mockReset();

        // Restore default resolved values after reset
        mockHashFunction.mockImplementation(async (_plain: string) => "hashed-password");
        mockUserEntityFromObject.mockImplementation((_obj: unknown) => buildUserEntity());

        dataSource = new UserDataSourceImpl(
            mockHashFunction as unknown as typeof import("@/core/utils").BcryptAdapter.hash,
            mockUserEntityFromObject as unknown as typeof import("@/app/Shared/Identity/infrastructure/mappers/user.mapper").UserMapper.userModelToEntity,
        );
    });

    // ---------------------------------------------------------------- //
    // create
    // ---------------------------------------------------------------- //
    describe("create", () => {
        test("should hash the password and create a new user when the email is not taken", async () => {
            const dto = buildValidRegisterUserDto();
            const modelInstance = buildUserModelInstance();

            userFindOneMock.mockResolvedValue(null);
            userCreateMock.mockResolvedValue(modelInstance);

            const result = await dataSource.create(dto);

            expect(userFindOneMock).toHaveBeenCalledTimes(1);
            expect(mockHashFunction).toHaveBeenCalledWith(dto.us_password_hash);
            expect(userCreateMock).toHaveBeenCalledTimes(1);
            expect(mockUserEntityFromObject).toHaveBeenCalledTimes(1);
            expect(result).toBeInstanceOf(UserEntity);
        });

        test("should throw CustomError.badRequest when the email is already registered", async () => {
            const dto = buildValidRegisterUserDto();
            userFindOneMock.mockResolvedValue(buildUserModelInstance());

            await expect(dataSource.create(dto)).rejects.toMatchObject({
                statusCode: 400,
                message: "User already exists",
            });

            expect(userCreateMock).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // update
    // ---------------------------------------------------------------- //
    describe("update", () => {
        test("should update the user fields and return the mapped entity", async () => {
            const modelInstance = buildUserModelInstance();
            userFindOneMock.mockResolvedValue(modelInstance);

            // 1. Arrange: Creamos la instancia real del DTO usando el método de fábrica
            const updatePayload = {
                us_full_name: "Jane Doe",
                us_email: "jane@example.com",
                us_role: "TEACHER" as UserRoles,
            };
            const [validationError, updateUserDto] = UpdateUserDto.create(updatePayload);

            // 2. Act: Pasamos el DTO real (usamos "!" porque sabemos que no hay error de validación en este test)
            const result = await dataSource.update("uuid-001", updateUserDto!);

            // 3. Assert
            expect(userFindOneMock).toHaveBeenCalledWith({ where: { us_id: "uuid-001" } });
            expect(modelInstance.update).toHaveBeenCalledTimes(1);
            expect(mockUserEntityFromObject).toHaveBeenCalledWith(modelInstance);
            expect(result).toBeInstanceOf(UserEntity);
        });

        test("should throw CustomError.notFound when the user does not exist", async () => {
            userFindOneMock.mockResolvedValue(null);

            // Creamos la instancia real del DTO
            const updatePayload = { us_full_name: "Ghost" };
            const [validationError, updateUserDto] = UpdateUserDto.create(updatePayload);

            // Verificamos el rechazo de la promesa
            await expect(dataSource.update("uuid-999", updateUserDto!)).rejects.toMatchObject({
                statusCode: 404,
                message: "User not found",
            });

            expect(mockUserEntityFromObject).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // changePassword
    // ---------------------------------------------------------------- //
    describe("changePassword", () => {
        test("should hash the new password, call update on the model, and return the entity", async () => {
            const modelInstance = buildUserModelInstance();
            userFindOneMock.mockResolvedValue(modelInstance);

            const result = await dataSource.changePassword("uuid-001", "NewPass123");

            expect(mockHashFunction).toHaveBeenCalledWith("NewPass123");
            expect(modelInstance.update).toHaveBeenCalledWith({ us_password_hash: "hashed-password" });
            expect(mockUserEntityFromObject).toHaveBeenCalledWith(modelInstance);
            expect(result).toBeInstanceOf(UserEntity);
        });

        test("should throw CustomError.notFound when the user does not exist", async () => {
            userFindOneMock.mockResolvedValue(null);

            await expect(dataSource.changePassword("uuid-999", "NewPass123")).rejects.toMatchObject({
                statusCode: 404,
                message: "User not found",
            });

            expect(mockHashFunction).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // changeStateActive
    // ---------------------------------------------------------------- //
    describe("changeStateActive", () => {
        test("should toggle us_is_active and return the mapped entity", async () => {
            const modelInstance = buildUserModelInstance({ us_is_active: true });
            userFindOneMock.mockResolvedValue(modelInstance);

            const result = await dataSource.changeStateActive("uuid-001");

            expect(modelInstance.update).toHaveBeenCalledWith({ us_is_active: false });
            expect(mockUserEntityFromObject).toHaveBeenCalledWith(modelInstance);
            expect(result).toBeInstanceOf(UserEntity);
        });

        test("should throw CustomError.notFound when the user does not exist", async () => {
            userFindOneMock.mockResolvedValue(null);

            await expect(dataSource.changeStateActive("uuid-999")).rejects.toMatchObject({
                statusCode: 404,
                message: "User not found",
            });

            expect(mockUserEntityFromObject).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // findById
    // ---------------------------------------------------------------- //
    describe("findById", () => {
        test("should return a mapped UserEntity when the user is found", async () => {
            const modelInstance = buildUserModelInstance();
            userFindOneMock.mockResolvedValue(modelInstance);

            const result = await dataSource.findById("uuid-001");

            expect(userFindOneMock).toHaveBeenCalledWith({ where: { us_id: "uuid-001" } });
            expect(mockUserEntityFromObject).toHaveBeenCalledWith(modelInstance);
            expect(result).toBeInstanceOf(UserEntity);
        });

        test("should throw CustomError.notFound when no user is found", async () => {
            userFindOneMock.mockResolvedValue(null);

            await expect(dataSource.findById("uuid-999")).rejects.toMatchObject({
                statusCode: 404,
                message: "User not found",
            });

            expect(mockUserEntityFromObject).not.toHaveBeenCalled();
        });
    });

    // ---------------------------------------------------------------- //
    // findAll
    // ---------------------------------------------------------------- //
    describe("findAll", () => {
        test("should return an array of mapped UserEntity objects", async () => {
            const modelInstances = [buildUserModelInstance(), buildUserModelInstance()];
            userFindAllMock.mockResolvedValue(modelInstances);

            const result = await dataSource.findAll();

            expect(userFindAllMock).toHaveBeenCalledTimes(1);
            expect(mockUserEntityFromObject).toHaveBeenCalledTimes(modelInstances.length);
            expect(result).toHaveLength(2);
            result.forEach(entity => expect(entity).toBeInstanceOf(UserEntity));
        });

        test("should return an empty array when there are no users", async () => {
            userFindAllMock.mockResolvedValue([]);

            const result = await dataSource.findAll();

            expect(result).toEqual([]);
            expect(mockUserEntityFromObject).not.toHaveBeenCalled();
        });
    });
});
