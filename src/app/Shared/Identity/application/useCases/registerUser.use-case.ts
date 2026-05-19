import type { RegisterUserDto } from "@/app/shared/Identity/domain/dtos";
import type { UserRepository } from "@/app/shared/Identity/domain/repositories/user.repository";


interface RegisterUserUseCase {
    execute(registerUserDto: RegisterUserDto): Promise<void>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(registerUserDto: RegisterUserDto): Promise<void> {
        await this.userRepository.create(registerUserDto);
    }


}