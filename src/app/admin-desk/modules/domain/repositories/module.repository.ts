import type { CreateModuleDto, UpdateModuleDto } from "@/app/admin-desk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";

export abstract class ModuleRepository {
    public abstract getAllModules(): Promise<ModuleEntity[]>;
    public abstract getModuleById(moduleId: string): Promise<ModuleEntity>;
    public abstract createModule(module: CreateModuleDto): Promise<void>;
    public abstract updateModule(id: string, module: UpdateModuleDto): Promise<void>;
    public abstract deleteModule(id: string): Promise<void>;
}
