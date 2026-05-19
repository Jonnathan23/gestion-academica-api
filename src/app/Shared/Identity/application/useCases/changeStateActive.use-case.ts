import type { UserRepository } from "@/app/shared/Identity/domain/repositories/user.repository";

interface ChangeStateActiveUseCase {
    execute(id: string): Promise<void>;
}

export class ChangeStateActive implements ChangeStateActiveUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string): Promise<void> {
        await this.userRepository.changeStateActive(id);
    }
}
