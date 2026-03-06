import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/AdminDesk/contracts/domain/dtos";
import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";

export abstract class StudentLevelDataSource {
    abstract purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>;
    abstract getStudentContracts(studentId: string): Promise<StudentLevelEntity[]>;
    abstract updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]>;
    abstract deleteStudentLevel(studentLevelId: string): Promise<boolean>;
}
