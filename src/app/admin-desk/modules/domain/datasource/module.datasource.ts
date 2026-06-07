import type { UpdateModuleDto, CreateModuleDto } from "@/app/admin-desk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";

export abstract class ModuleDataSource {
    abstract getAllModules(): Promise<ModuleEntity[]>;
    abstract getModuleById(moduleId: string): Promise<ModuleEntity>;
    abstract createModule(module: CreateModuleDto): Promise<void>;
    abstract updateModule(id: string, module: UpdateModuleDto): Promise<void>;
    abstract deleteModule(id: string): Promise<void>;
}
