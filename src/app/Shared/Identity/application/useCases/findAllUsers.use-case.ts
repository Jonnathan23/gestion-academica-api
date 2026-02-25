import type { UserEntity } from "@/app/Shared/Identity/domain/entities";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";


interface FindAllUsersUseCase {
    execute(): Promise<UserEntity[]>;
}

export class FindAllUsers implements FindAllUsersUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(): Promise<UserEntity[]> {
        return await this.userRepository.findAll();
    }
}