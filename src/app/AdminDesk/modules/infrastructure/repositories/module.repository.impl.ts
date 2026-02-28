import type { ModuleDataSource } from "@/app/AdminDesk/modules/domain/datasource/module.datasource";
import type { CreateModuleDto, UpdateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import type { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";

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