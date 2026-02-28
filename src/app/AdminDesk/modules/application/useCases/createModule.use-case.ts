import type { CreateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import type { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";


interface CreateModuleUseCase {
    execute(module: CreateModuleDto): Promise<void>;
}

export class CreateModule implements CreateModuleUseCase {

    constructor(
        private readonly moduleRepository: ModuleRepository
    ) { }

    async execute(module: CreateModuleDto): Promise<void> {
        await this.moduleRepository.createModule(module);
    }
}