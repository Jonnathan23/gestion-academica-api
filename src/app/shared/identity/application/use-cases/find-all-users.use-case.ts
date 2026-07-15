import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";
import { UserDataEntity } from "@/app/shared/identity/domain/entities/user-data.entity";

interface FindAllUsersUseCase {
    execute(): Promise<UserDataEntity[]>;
}

export class FindAllUsers implements FindAllUsersUseCase {
    public constructor(private readonly userRepository: UserRepository) {}

    public async execute(): Promise<UserDataEntity[]> {
        return await this.userRepository.findAll();
    }
}
