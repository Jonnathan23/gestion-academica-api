import type { UserDataEntity } from "@/app/shared/identity/domain/entities";
import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";

interface FindUserByIdUseCase {
    execute(id: string): Promise<UserDataEntity>;
}

export class FindUserById implements FindUserByIdUseCase {
    public constructor(private readonly userRepository: UserRepository) {}

    public async execute(id: string): Promise<UserDataEntity> {
        return await this.userRepository.findById(id);
    }
}
