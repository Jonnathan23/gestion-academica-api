import type { StudentLevelDataSource } from "@/app/admin-desk/student-level/domain/datasource/studentLevel.datasource";
import type { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";

export class StudentLevelRepositoryImpl implements StudentLevelRepository {
    constructor(private readonly datasource: StudentLevelDataSource) {}

    public saveProgressionTransaction(
        newContracts: StudentLevelEntity[],
        contractsToUpdate: StudentLevelEntity[],
    ): Promise<StudentLevelEntity[]> {
        return this.datasource.saveProgressionTransaction(newContracts, contractsToUpdate);
    }

    public getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]> {
        return this.datasource.getStudentContracts(studentId);
    }

    public getModulesByIds(moduleIds: string[]): Promise<ModuleEntity[]> {
        return this.datasource.getModulesByIds(moduleIds);
    }

    public unlockLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        return this.datasource.unlockLevel(dto);
    }

    public blockLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        return this.datasource.blockLevel(dto);
    }

    public deleteStudentLevel(contractId: string): Promise<boolean> {
        return this.datasource.deleteStudentLevel(contractId);
    }

    public buildContractEntities(currentContracts: StudentLevelDetailsProjection[]): StudentLevelEntity[] {
        return this.datasource.buildContractEntities(currentContracts);
    }

    public buildNewContractsEntities(studentId: string, sellerId: string, modulesToPurchase: ModuleEntity[]): StudentLevelEntity[] {
        return this.datasource.buildNewContractsEntities(studentId, sellerId, modulesToPurchase);
    }
}
