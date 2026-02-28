import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import type { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";



interface GetModuleByIdUseCase {
    execute(id: string): Promise<ModuleEntity>;
}

export class GetModuleById implements GetModuleByIdUseCase {
    constructor(
        private readonly moduleRepository: ModuleRepository
    ) { }

    async execute(id: string): Promise<ModuleEntity> {
        return await this.moduleRepository.getModuleById(id);
    }
}