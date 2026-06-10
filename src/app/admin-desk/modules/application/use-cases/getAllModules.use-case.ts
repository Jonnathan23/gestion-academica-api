import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";

interface GetAllModulesUseCase {
    execute(): Promise<ModuleEntity[]>;
}

export class GetAllModules implements GetAllModulesUseCase {
    constructor(private readonly moduleRepository: ModuleRepository) {}

    async execute(): Promise<ModuleEntity[]> {
        return await this.moduleRepository.getAllModules();
    }
}
