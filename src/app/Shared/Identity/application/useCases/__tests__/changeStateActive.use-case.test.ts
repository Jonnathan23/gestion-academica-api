import { describe, test, expect, mock, beforeEach } from "bun:test";
import { ChangeStateActive } from "@/app/Shared/Identity/application/useCases/changeStateActive.use-case";
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
        "false",
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
describe("ChangeStateActive use case", () => {
    let mockUserRepository: UserRepository;
    let changeStateActive: ChangeStateActive;

    beforeEach(() => {
        mockUserRepository = buildMockUserRepository();
        changeStateActive = new ChangeStateActive(mockUserRepository);
    });

    test("should call userRepository.changeStateActive with the correct id", async () => {
        await changeStateActive.execute(TARGET_USER_ID);

        expect(mockUserRepository.changeStateActive).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.changeStateActive).toHaveBeenCalledWith(TARGET_USER_ID);
    });

    test("should resolve without throwing when the repository call succeeds", async () => {
        await expect(
            changeStateActive.execute(TARGET_USER_ID)
        ).resolves.toBeUndefined();
    });

    test("should propagate an error thrown by the repository", async () => {
        const repositoryError = new Error("User not found");
        (mockUserRepository.changeStateActive as ReturnType<typeof mock>).mockImplementation(
            async () => { throw repositoryError; }
        );

        await expect(
            changeStateActive.execute(TARGET_USER_ID)
        ).rejects.toThrow("User not found");
    });

    test("should not call any other repository method", async () => {
        await changeStateActive.execute(TARGET_USER_ID);

        expect(mockUserRepository.create).not.toHaveBeenCalled();
        expect(mockUserRepository.login).not.toHaveBeenCalled();
        expect(mockUserRepository.update).not.toHaveBeenCalled();
        expect(mockUserRepository.changePassword).not.toHaveBeenCalled();
        expect(mockUserRepository.findById).not.toHaveBeenCalled();
        expect(mockUserRepository.findAll).not.toHaveBeenCalled();
    });
});
