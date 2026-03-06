import type { PurchaseModulesDto } from "@/app/AdminDesk/contracts/domain/dtos";
import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";
import type { StudentLevelRepository } from "@/app/AdminDesk/contracts/domain/repositories/contract.repository";

export interface PurchaseModulesUseCase {
    execute(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>;
}

export class PurchaseModules implements PurchaseModulesUseCase {
    constructor(
        private readonly repository: StudentLevelRepository
    ) { }

    execute(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        return this.repository.purchaseModules(dto);
    }
}
