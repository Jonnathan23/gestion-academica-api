import { describe, test, expect, mock, beforeEach } from "bun:test";
import { FindUserById } from "@/app/Shared/Identity/application/useCases/findUserById.use-case";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //
const TARGET_USER_ID = "uuid-target-001";

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
describe("FindUserById use case", () => {
    let mockUserRepository: UserRepository;
    let findUserById: FindUserById;

    beforeEach(() => {
        mockUserRepository = buildMockUserRepository();
        findUserById = new FindUserById(mockUserRepository);
    });

    test("should call userRepository.findById with the correct id", async () => {
        await findUserById.execute(TARGET_USER_ID);

        expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(TARGET_USER_ID);
    });

    test("should return the UserEntity returned by the repository", async () => {
        const expectedEntity = buildUserEntity();

        const result = await findUserById.execute(TARGET_USER_ID);

        expect(result).toBeInstanceOf(UserEntity);
        expect(result.us_id).toBe(expectedEntity.us_id);
        expect(result.us_email).toBe(expectedEntity.us_email);
    });

    test("should propagate a 'User not found' error thrown by the repository", async () => {
        const repositoryError = new Error("User not found");
        (mockUserRepository.findById as ReturnType<typeof mock>).mockImplementation(
            async () => { throw repositoryError; }
        );

        await expect(
            findUserById.execute(TARGET_USER_ID)
        ).rejects.toThrow("User not found");
    });

    test("should not call any other repository method", async () => {
        await findUserById.execute(TARGET_USER_ID);

        expect(mockUserRepository.create).not.toHaveBeenCalled();
        expect(mockUserRepository.login).not.toHaveBeenCalled();
        expect(mockUserRepository.update).not.toHaveBeenCalled();
        expect(mockUserRepository.changePassword).not.toHaveBeenCalled();
        expect(mockUserRepository.changeStateActive).not.toHaveBeenCalled();
        expect(mockUserRepository.findAll).not.toHaveBeenCalled();
    });
});
