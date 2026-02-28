import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import type { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";


interface GetAllModulesUseCase {
    execute(): Promise<ModuleEntity[]>
}

export class GetAllModules implements GetAllModulesUseCase {
    constructor(
        private readonly moduleRepository: ModuleRepository
    ) { }

    async execute(): Promise<ModuleEntity[]> {
        return await this.moduleRepository.getAllModules();
    }
}