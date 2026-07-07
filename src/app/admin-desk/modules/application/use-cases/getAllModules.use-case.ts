import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";

interface GetAllModulesUseCase {
    execute(): Promise<ModuleEntity[]>;
}

export class GetAllModules implements GetAllModulesUseCase {
    public constructor(private readonly moduleRepository: ModuleRepository) {}

    public async execute(): Promise<ModuleEntity[]> {
        return await this.moduleRepository.getAllModules();
    }
}
