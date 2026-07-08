import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";
import { UpdateModuleDto } from "@/app/admin-desk/modules/application/dtos/update-module.dto";

interface UpdateModuleUseCase {
    execute(id: string, module: UpdateModuleDto): Promise<void>;
}

export class UpdateModule implements UpdateModuleUseCase {
    public constructor(private readonly moduleRepository: ModuleRepository) {}

    public async execute(id: string, module: UpdateModuleDto): Promise<void> {
        await this.moduleRepository.updateModule(id, module);
    }
}
