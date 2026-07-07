import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";
import { UpdateUserDto } from "@/app/shared/identity/domain/dtos/update-user.dto";

interface UpdateUserUseCase {
    execute(id: string, userDto: UpdateUserDto): Promise<void>;
}

export class UpdateUser implements UpdateUserUseCase {
    public constructor(private readonly userRepository: UserRepository) {}

    public async execute(id: string, userDto: UpdateUserDto): Promise<void> {
        await this.userRepository.update(id, userDto);
    }
}
