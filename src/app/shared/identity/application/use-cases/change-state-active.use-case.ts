import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";

interface ChangeStateActiveUseCase {
    execute(id: string): Promise<void>;
}

export class ChangeStateActive implements ChangeStateActiveUseCase {
    public constructor(private readonly userRepository: UserRepository) {}

    public async execute(id: string): Promise<void> {
        await this.userRepository.changeStateActive(id);
    }
}
