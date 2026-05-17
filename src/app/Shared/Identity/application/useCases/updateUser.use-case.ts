import type { UpdateUserDto } from "@/app/shared/Identity/domain/dtos";
import type { UserRepository } from "@/app/shared/Identity/domain/repositories/user.repository";


interface UpdateUserUseCase {
    execute(id: string, userDto: UpdateUserDto): Promise<void>;
}

export class UpdateUser implements UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(id: string, userDto: UpdateUserDto): Promise<void> {
        await this.userRepository.update(id, userDto);
    }
}
