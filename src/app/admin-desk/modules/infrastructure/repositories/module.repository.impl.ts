import type { ModuleDataSource } from "@/app/admin-desk/modules/domain/datasource/module.datasource";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";
import { CreateModuleDto } from "@/app/admin-desk/modules/domain/dtos/create-module.dto";
import { UpdateModuleDto } from "@/app/admin-desk/modules/domain/dtos/update-module.dto";

export class ModuleRepositoryImpl implements ModuleRepository {
    public constructor(private readonly moduleDataSource: ModuleDataSource) {}

    public getAllModules(): Promise<ModuleEntity[]> {
        return this.moduleDataSource.getAllModules();
    }

    public getModuleById(moduleId: string): Promise<ModuleEntity> {
        return this.moduleDataSource.getModuleById(moduleId);
    }

    public createModule(module: CreateModuleDto): Promise<void> {
        return this.moduleDataSource.createModule(module);
    }

    public updateModule(id: string, module: UpdateModuleDto): Promise<void> {
        return this.moduleDataSource.updateModule(id, module);
    }

    public deleteModule(id: string): Promise<void> {
        return this.moduleDataSource.deleteModule(id);
    }
}
