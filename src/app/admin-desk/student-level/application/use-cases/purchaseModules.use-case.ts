import type { PurchaseModulesDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";

export interface PurchaseModulesUseCase {
    execute(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>;
}

export class PurchaseModules implements PurchaseModulesUseCase {
    constructor(private readonly repository: StudentLevelRepository) {}

    execute(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        return this.repository.purchaseModules(dto);
    }
}
