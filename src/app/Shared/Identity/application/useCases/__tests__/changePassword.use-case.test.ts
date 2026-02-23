import { describe, test, expect, mock, beforeEach } from "bun:test";
import { ChangePassword } from "@/app/Shared/Identity/application/useCases/changePassword.use-case";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";

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
        "hashed-NewSecurePass1",
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
describe("ChangePassword use case", () => {
    let mockUserRepository: UserRepository;
    let changePassword: ChangePassword;

    beforeEach(() => {
        mockUserRepository = buildMockUserRepository();
        changePassword = new ChangePassword(mockUserRepository);
    });

    test("should call userRepository.changePassword with the correct id and password", async () => {
        await changePassword.execute(TARGET_USER_ID, NEW_PASSWORD);

        expect(mockUserRepository.changePassword).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.changePassword).toHaveBeenCalledWith(
            TARGET_USER_ID,
            NEW_PASSWORD
        );
    });

    test("should resolve without throwing when the repository call succeeds", async () => {
        await expect(
            changePassword.execute(TARGET_USER_ID, NEW_PASSWORD)
        ).resolves.toBeUndefined();
    });

    test("should propagate an error thrown by the repository", async () => {
        const repositoryError = new Error("User not found");
        (mockUserRepository.changePassword as ReturnType<typeof mock>).mockImplementation(
            async () => { throw repositoryError; }
        );

        await expect(
            changePassword.execute(TARGET_USER_ID, NEW_PASSWORD)
        ).rejects.toThrow("User not found");
    });

    test("should not call any other repository method", async () => {
        await changePassword.execute(TARGET_USER_ID, NEW_PASSWORD);

        expect(mockUserRepository.create).not.toHaveBeenCalled();
        expect(mockUserRepository.login).not.toHaveBeenCalled();
        expect(mockUserRepository.update).not.toHaveBeenCalled();
        expect(mockUserRepository.changeStateActive).not.toHaveBeenCalled();
        expect(mockUserRepository.findById).not.toHaveBeenCalled();
        expect(mockUserRepository.findAll).not.toHaveBeenCalled();
    });
});
