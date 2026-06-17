import type { UserDataEntity } from "@/app/shared/identity/domain/entities";
import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";

interface FindAllUsersUseCase {
    execute(): Promise<UserDataEntity[]>;
}

export class FindAllUsers implements FindAllUsersUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<UserDataEntity[]> {
        return await this.userRepository.findAll();
    }
}
