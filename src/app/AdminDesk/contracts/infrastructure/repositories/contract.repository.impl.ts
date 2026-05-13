import type { StudentLevelDataSource } from "@/app/AdminDesk/contracts/domain/datasource/contract.datasource";
import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/AdminDesk/contracts/domain/dtos";
import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";
import type { StudentLevelDetailsProjection } from "@/app/AdminDesk/contracts/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/AdminDesk/contracts/domain/repositories/contract.repository";

export class StudentLevelRepositoryImpl implements StudentLevelRepository {
    constructor(
        private readonly datasource: StudentLevelDataSource
    ) { }

    purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        return this.datasource.purchaseModules(dto);
    }

    getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]> {
        return this.datasource.getStudentContracts(studentId);
    }

    updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]> {
        return this.datasource.updateStudentLevel(dto);
    }

    deleteStudentLevel(studentLevelId: string): Promise<boolean> {
        return this.datasource.deleteStudentLevel(studentLevelId);
    }
}
