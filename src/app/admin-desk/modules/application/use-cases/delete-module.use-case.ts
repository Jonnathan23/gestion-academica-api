import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";

interface DeleteModuleUseCase {
    execute(id: string): Promise<void>;
}

export class DeleteModule implements DeleteModuleUseCase {
    public constructor(private readonly moduleRepository: ModuleRepository) {}

    public async execute(id: string): Promise<void> {
        return await this.moduleRepository.deleteModule(id);
    }
}
