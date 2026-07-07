import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";

interface GetModuleByIdUseCase {
    execute(id: string): Promise<ModuleEntity>;
}

export class GetModuleById implements GetModuleByIdUseCase {
    public constructor(private readonly moduleRepository: ModuleRepository) {}

    public async execute(id: string): Promise<ModuleEntity> {
        return await this.moduleRepository.getModuleById(id);
    }
}
