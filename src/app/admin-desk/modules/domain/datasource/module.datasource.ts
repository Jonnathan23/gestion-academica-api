import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import { UpdateModuleDto } from "@/app/admin-desk/modules/application/dtos/update-module.dto";
import { CreateModuleDto } from "@/app/admin-desk/modules/application/dtos/create-module.dto";

export abstract class ModuleDataSource {
    public abstract getAllModules(): Promise<ModuleEntity[]>;
    public abstract getModuleById(moduleId: string): Promise<ModuleEntity>;
    public abstract createModule(module: CreateModuleDto): Promise<void>;
    public abstract updateModule(id: string, module: UpdateModuleDto): Promise<void>;
    public abstract deleteModule(id: string): Promise<void>;
}
