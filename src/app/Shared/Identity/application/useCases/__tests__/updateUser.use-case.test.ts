import { describe, test, expect, mock, beforeEach } from "bun:test";
import { UpdateUser } from "@/app/Shared/Identity/application/useCases/updateUser.use-cases";
import { UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //
const TARGET_USER_ID = "uuid-target-001";

const buildValidUpdateUserDto = (): UpdateUserDto => {
    const [error, dto] = UpdateUserDto.create({
        us_full_name: "Jane Updated",
        us_email: "jane.updated@example.com",
        us_role: "TEACHER",
    });

    if (error || !dto) throw new Error(`Test setup failed: ${error}`);
    return dto;
};

const buildUserEntity = (): UserEntity =>
    new UserEntity(
        TARGET_USER_ID,
        "Jane Updated",
        "jane.updated@example.com",
        "hashed-password",
        "TEACHER",
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
describe("UpdateUser use case", () => {
    let mockUserRepository: UserRepository;
    let updateUser: UpdateUser;

    beforeEach(() => {
        mockUserRepository = buildMockUserRepository();
        updateUser = new UpdateUser(mockUserRepository);
    });

    test("should call userRepository.update with the correct id and UpdateUserDto", async () => {
        const updateUserDto = buildValidUpdateUserDto();

        await updateUser.execute(TARGET_USER_ID, updateUserDto);

        expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
        expect(mockUserRepository.update).toHaveBeenCalledWith(TARGET_USER_ID, updateUserDto);
    });

    test("should resolve without throwing when the repository call succeeds", async () => {
        const updateUserDto = buildValidUpdateUserDto();

        await expect(
            updateUser.execute(TARGET_USER_ID, updateUserDto)
        ).resolves.toBeUndefined();
    });

    test("should propagate an error thrown by the repository", async () => {
        const repositoryError = new Error("User not found");
        (mockUserRepository.update as ReturnType<typeof mock>).mockImplementation(
            async () => { throw repositoryError; }
        );

        const updateUserDto = buildValidUpdateUserDto();

        await expect(
            updateUser.execute(TARGET_USER_ID, updateUserDto)
        ).rejects.toThrow("User not found");
    });

    test("should forward a partial dto (only name) to the repository", async () => {
        const [error, partialDto] = UpdateUserDto.create({ us_full_name: "Only Name" });
        if (error || !partialDto) throw new Error(`Test setup failed: ${error}`);

        await updateUser.execute(TARGET_USER_ID, partialDto);

        expect(mockUserRepository.update).toHaveBeenCalledWith(TARGET_USER_ID, partialDto);
    });

    test("should not call any other repository method", async () => {
        const updateUserDto = buildValidUpdateUserDto();

        await updateUser.execute(TARGET_USER_ID, updateUserDto);

        expect(mockUserRepository.create).not.toHaveBeenCalled();
        expect(mockUserRepository.login).not.toHaveBeenCalled();
        expect(mockUserRepository.changePassword).not.toHaveBeenCalled();
        expect(mockUserRepository.changeStateActive).not.toHaveBeenCalled();
        expect(mockUserRepository.findById).not.toHaveBeenCalled();
        expect(mockUserRepository.findAll).not.toHaveBeenCalled();
    });
});
