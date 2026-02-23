import { describe, test, expect, mock, beforeEach } from "bun:test";
import { RegisterUser } from "@/app/Shared/Identity/application/useCases/registerUser.use-case";
import { RegisterUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //
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

const buildUserEntity = (): UserEntity =>
    new UserEntity(
        "uuid-001",
        "John Doe",
        "john.doe@example.com",
        "hashed-SecurePass1",
        "ADMIN",
        "true",
        new Date().toISOString(),
        new Date().toISOString(),
    );

// ------------------------------------------------------------------ //
// Mock repository factory
// ------------------------------------------------------------------ //
const buildMockUserRepository = (): UserRepository => ({
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
describe("RegisterUser use case", () => {
    let mockUserRepository: UserRepository;
    let registerUser: RegisterUser;

    beforeEach(() => {
        mockUserRepository = buildMockUserRepository();
        registerUser = new RegisterUser(mockUserRepository);
    });

    test("should call userRepository.create with the provided RegisterUserDto", async () => {
        const registerUserDto = buildValidRegisterUserDto();

        await registerUser.execute(registerUserDto);

        expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.create).toHaveBeenCalledWith(registerUserDto);
    });

    test("should resolve without throwing when the repository call succeeds", async () => {
        const registerUserDto = buildValidRegisterUserDto();

        await expect(registerUser.execute(registerUserDto)).resolves.toBeUndefined();
    });

    test("should propagate an error thrown by the repository", async () => {
        const repositoryError = new Error("Database connection failed");
        (mockUserRepository.create as ReturnType<typeof mock>).mockImplementation(
            async () => { throw repositoryError; }
        );

        const registerUserDto = buildValidRegisterUserDto();

        await expect(registerUser.execute(registerUserDto)).rejects.toThrow(
            "Database connection failed"
        );
    });

    test("should not call any other repository method", async () => {
        const registerUserDto = buildValidRegisterUserDto();

        await registerUser.execute(registerUserDto);

        expect(mockUserRepository.login).not.toHaveBeenCalled();
        expect(mockUserRepository.update).not.toHaveBeenCalled();
        expect(mockUserRepository.changePassword).not.toHaveBeenCalled();
        expect(mockUserRepository.changeStateActive).not.toHaveBeenCalled();
        expect(mockUserRepository.findById).not.toHaveBeenCalled();
        expect(mockUserRepository.findAll).not.toHaveBeenCalled();
    });
});
