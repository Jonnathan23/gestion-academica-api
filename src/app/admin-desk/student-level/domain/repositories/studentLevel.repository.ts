import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";


export abstract class StudentLevelRepository {
    abstract purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>;
    abstract getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]>;
    abstract updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]>;
    abstract deleteStudentLevel(studentLevelId: string): Promise<boolean>;
}
