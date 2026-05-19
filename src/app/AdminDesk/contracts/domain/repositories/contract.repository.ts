import type { StudentLevelDetailsProjection } from "@/app/AdminDesk/contracts/domain/projections/ContractDetails.projection";
import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/AdminDesk/contracts/domain/dtos";
import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";


export abstract class StudentLevelRepository {
    abstract purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>;
    abstract getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]>;
    abstract updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]>;
    abstract deleteStudentLevel(studentLevelId: string): Promise<boolean>;
}
