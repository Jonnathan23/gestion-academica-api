import type { ModuleDataSource } from "@/app/admin-desk/modules/domain/datasource/module.datasource";
import type { CreateModuleDto, UpdateModuleDto } from "@/app/admin-desk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";

export class ModuleRepositoryImpl implements ModuleRepository {

    constructor(
        private readonly moduleDataSource: ModuleDataSource
    ) { }

    getAllModules(): Promise<ModuleEntity[]> {
        return this.moduleDataSource.getAllModules();
    }

    getModuleById(moduleId: string): Promise<ModuleEntity> {
        return this.moduleDataSource.getModuleById(moduleId);
    }

    createModule(module: CreateModuleDto): Promise<void> {
        return this.moduleDataSource.createModule(module);
    }

    updateModule(id: string, module: UpdateModuleDto): Promise<void> {
        return this.moduleDataSource.updateModule(id, module);
    }

    deleteModule(id: string): Promise<void> {
        return this.moduleDataSource.deleteModule(id);
    }
}