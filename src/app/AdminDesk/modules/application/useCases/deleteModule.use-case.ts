import type { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";


interface DeleteModuleUseCase {
    execute(id: string): Promise<void>
}

export class DeleteModule implements DeleteModuleUseCase {

    constructor(private readonly moduleRepository: ModuleRepository) { }

    async execute(id: string): Promise<void> {
        return await this.moduleRepository.deleteModule(id);
    }
}