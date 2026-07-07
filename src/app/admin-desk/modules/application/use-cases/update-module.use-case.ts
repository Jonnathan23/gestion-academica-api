import type { UpdateModuleDto } from "@/app/admin-desk/modules/domain/dtos";
import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";

interface UpdateModuleUseCase {
    execute(id: string, module: UpdateModuleDto): Promise<void>;
}

export class UpdateModule implements UpdateModuleUseCase {
    public constructor(private readonly moduleRepository: ModuleRepository) {}

    public async execute(id: string, module: UpdateModuleDto): Promise<void> {
        await this.moduleRepository.updateModule(id, module);
    }
}
