import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/AdminDesk/contracts/domain/dtos";
import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";
import type { StudentLevelDetailsProjection } from "@/app/AdminDesk/contracts/domain/projections/ContractDetails.projection";

export abstract class StudentLevelDataSource {
    abstract purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>;
    abstract getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]>;
    abstract updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]>;
    abstract deleteStudentLevel(studentLevelId: string): Promise<boolean>;
}
