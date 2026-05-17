import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";

export abstract class StudentLevelDataSource {
    abstract purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>;
    abstract getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]>;
    abstract updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]>;
    abstract deleteStudentLevel(studentLevelId: string): Promise<boolean>;
    abstract finishCurrentLevel(studentLevelId: string): Promise<boolean>;
}
