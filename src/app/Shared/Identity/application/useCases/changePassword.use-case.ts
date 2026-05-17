import type { UserRepository } from "@/app/shared/Identity/domain/repositories/user.repository";



interface ChangePasswordUseCase {
    execute(id: string, password: string): Promise<void>;
}

export class ChangePassword implements ChangePasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(id: string, password: string): Promise<void> {
        await this.userRepository.changePassword(id, password);
    }
}
