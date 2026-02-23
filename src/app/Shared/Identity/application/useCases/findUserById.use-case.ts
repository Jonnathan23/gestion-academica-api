import type { UserEntity } from "@/app/Shared/Identity/domain/entities";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";


interface FindUserByIdUseCase {
    execute(id: string): Promise<UserEntity>;
}

export class FindUserById implements FindUserByIdUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(id: string): Promise<UserEntity> {
        return await this.userRepository.findById(id);
    }
}