import type { StudentLevelDataSource } from "@/app/admin-desk/student-level/domain/datasource/studentLevel.datasource";
import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";

export class StudentLevelRepositoryImpl implements StudentLevelRepository {
    constructor(private readonly datasource: StudentLevelDataSource) {}

    purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        return this.datasource.purchaseModules(dto);
    }

    getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]> {
        return this.datasource.getStudentContracts(studentId);
    }

    unlockLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        return this.datasource.unlockLevel(dto);
    }

    blockLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        return this.datasource.blockLevel(dto);
    }

    finishCurrentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        return this.datasource.finishCurrentLevel(dto);
    }

    deleteStudentLevel(studentLevelId: string): Promise<boolean> {
        return this.datasource.deleteStudentLevel(studentLevelId);
    }
}
