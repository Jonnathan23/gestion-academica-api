import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";

interface ChangePasswordUseCase {
    execute(id: string, password: string): Promise<void>;
}

export class ChangePassword implements ChangePasswordUseCase {
    public constructor(private readonly userRepository: UserRepository) {}

    public async execute(id: string, password: string): Promise<void> {
        await this.userRepository.changePassword(id, password);
    }
}
