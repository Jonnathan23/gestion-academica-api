import type { CreateModuleDto, UpdateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";


export abstract class ModuleRepository {
    abstract getAllModules(): Promise<ModuleEntity[]>
    abstract getModuleById(moduleId: string): Promise<ModuleEntity>
    abstract createModule(module: CreateModuleDto): Promise<void>
    abstract updateModule(id: string, module: UpdateModuleDto): Promise<void>
    abstract deleteModule(id: string): Promise<void>
}