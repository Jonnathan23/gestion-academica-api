import type { UserDataEntity, UserEntity } from "@/app/shared/Identity/domain/entities";
import type { UserRepository } from "@/app/shared/Identity/domain/repositories/user.repository";


interface FindUserByIdUseCase {
    execute(id: string): Promise<UserDataEntity>;
}

export class FindUserById implements FindUserByIdUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(id: string): Promise<UserDataEntity> {
        return await this.userRepository.findById(id);
    }
}