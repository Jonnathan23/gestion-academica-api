import type { UpdateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import type { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";


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