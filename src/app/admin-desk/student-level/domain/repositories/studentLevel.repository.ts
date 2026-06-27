import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
export abstract class StudentLevelRepository {
    public abstract saveProgressionTransaction(
        newContracts: StudentLevelEntity[],
        contractsToUpdate: StudentLevelEntity[],
    ): Promise<StudentLevelEntity[]>;
    public abstract getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]>;
    public abstract getModulesByIds(moduleIds: string[]): Promise<ModuleEntity[]>;
    public abstract unlockLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity>;
    public abstract blockLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity>;
    public abstract finishCurrentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity>;
    public abstract deleteStudentLevel(studentLevelId: string): Promise<boolean>;

    public abstract buildContractEntities(currentContracts: StudentLevelDetailsProjection[]): StudentLevelEntity[];
    public abstract buildNewContractsEntities(studentId: string, sellerId: string, modulesToPurchase: ModuleEntity[]): StudentLevelEntity[];
}
