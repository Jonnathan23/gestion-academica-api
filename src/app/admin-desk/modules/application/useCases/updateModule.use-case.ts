import type { UpdateModuleDto } from "@/app/admin-desk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";


interface UpdateModuleUseCase {
    execute(id: string, module: UpdateModuleDto): Promise<void>
}

export class UpdateModule implements UpdateModuleUseCase {

    constructor(
        private readonly moduleRepository: ModuleRepository
    ) { }

    async execute(id: string, module: UpdateModuleDto): Promise<void> {
        await this.moduleRepository.updateModule(id, module);
    }
}