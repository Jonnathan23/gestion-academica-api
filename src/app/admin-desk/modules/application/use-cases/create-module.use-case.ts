import type { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";
import { CreateModuleDto } from "@/app/admin-desk/modules/domain/dtos/create-module.dto";

interface CreateModuleUseCase {
    execute(module: CreateModuleDto): Promise<void>;
}

export class CreateModule implements CreateModuleUseCase {
    public constructor(private readonly moduleRepository: ModuleRepository) {}

    public async execute(module: CreateModuleDto): Promise<void> {
        await this.moduleRepository.createModule(module);
    }
}
