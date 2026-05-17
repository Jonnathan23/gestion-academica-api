import type { CreateModuleDto } from "@/app/admin-desk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";


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