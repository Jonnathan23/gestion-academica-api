import { describe, test, expect, mock, beforeEach } from "bun:test";
import { FindAllUsers } from "@/app/Shared/Identity/application/useCases/findAllUsers.use-case";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //
const buildUserEntity = (identifier: string): UserEntity =>
    new UserEntity(
        `uuid-${identifier}`,
        `User ${identifier}`,
        `user${identifier}@example.com`,
        "hashed-password",
        "ADMIN",
        "true",
        new Date().toISOString(),
        new Date().toISOString(),
    );

// ------------------------------------------------------------------ //
// Mock repository factory
// ------------------------------------------------------------------ //
const buildMockUserRepository = (users: UserEntity[]): UserRepository => ({
    create: mock(async (_dto) => buildUserEntity("new")),
    login: mock(async (_dto) => buildUserEntity("logged")),
    update: mock(async (_id, _dto) => buildUserEntity("updated")),
    changePassword: mock(async (_id, _password) => buildUserEntity("pw")),
    changeStateActive: mock(async (_id) => buildUserEntity("toggled")),
    findById: mock(async (_id) => buildUserEntity("found")),
    findAll: mock(async () => users),
});

// ------------------------------------------------------------------ //
// Tests
// ------------------------------------------------------------------ //
describe("FindAllUsers use case", () => {
    let mockUserRepository: UserRepository;
    let findAllUsers: FindAllUsers;

    const storedUsers = [
        buildUserEntity("001"),
        buildUserEntity("002"),
        buildUserEntity("003"),
    ];

    beforeEach(() => {
        mockUserRepository = buildMockUserRepository(storedUsers);
        findAllUsers = new FindAllUsers(mockUserRepository);
    });

    test("should call userRepository.findAll once", async () => {
        await findAllUsers.execute();

        expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test("should return the full list of UserEntity objects from the repository", async () => {
        const result = await findAllUsers.execute();

        expect(result).toEqual(storedUsers);
        expect(result).toHaveLength(storedUsers.length);
    });

    test("should return an empty array when the repository has no users", async () => {
        const emptyRepository = buildMockUserRepository([]);
        const emptyFindAllUsers = new FindAllUsers(emptyRepository);

        const result = await emptyFindAllUsers.execute();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    test("should propagate an error thrown by the repository", async () => {
        const repositoryError = new Error("Database unavailable");
        (mockUserRepository.findAll as ReturnType<typeof mock>).mockImplementation(
            async () => { throw repositoryError; }
        );

        await expect(findAllUsers.execute()).rejects.toThrow("Database unavailable");
    });

    test("should not call any other repository method", async () => {
        await findAllUsers.execute();

        expect(mockUserRepository.create).not.toHaveBeenCalled();
        expect(mockUserRepository.login).not.toHaveBeenCalled();
        expect(mockUserRepository.update).not.toHaveBeenCalled();
        expect(mockUserRepository.changePassword).not.toHaveBeenCalled();
        expect(mockUserRepository.changeStateActive).not.toHaveBeenCalled();
        expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });
});
