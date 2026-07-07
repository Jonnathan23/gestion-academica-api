import { CustomError } from "@/core/error";
import { studentModuleStatus } from "@/core/interfaces/Contracts.interface";
import type { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";
import type { LevelProgressionDomainService } from "@/app/admin-desk/student-level/domain/services/levelProgression.domain.service";

//* Props
interface ValidateTargetLevelProps {
    readonly studentId: string;
    readonly studentLevelId: string;
}

interface ValidatePreviousLevelsProps {
    readonly currentContracts: StudentLevelDetailsProjection[];
    readonly targetModuleLevel: number;
}

interface ProcessSelfHealingProps {
    readonly currentContractsEntities: StudentLevelEntity[];
    readonly targetEntity: StudentLevelEntity;
}

interface CurrentContractsEntitiesProps {
    readonly currentContracts: StudentLevelDetailsProjection[];
    readonly studentLevelId: string;
}

//* Outs

interface CurrentContractsEntitiesResponse {
    readonly currentContractsEntities: StudentLevelEntity[];
    readonly targetEntity: StudentLevelEntity;
}

//* Rules
export interface FinishCurrentLevelUseCase {
    execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity>;
}

export class FinishCurrentLevel implements FinishCurrentLevelUseCase {
    constructor(
        private readonly repository: StudentLevelRepository,
        private readonly levelProgressionDomainService: LevelProgressionDomainService,
    ) {}

    public async execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        const { studentLevelId, studentId } = dto;

        const currentContracts = await this.validateTargetLevel({ studentLevelId, studentId });

        const { currentContractsEntities, targetEntity } = await this.validateCurrentContractsEntities({
            currentContracts,
            studentLevelId,
        });

        const finalContractsToUpdate = this.processSelfHealing({ currentContractsEntities, targetEntity });

        await this.repository.saveProgressionTransaction([], finalContractsToUpdate);

        return targetEntity;
    }

    private async validateTargetLevel(props: ValidateTargetLevelProps): Promise<StudentLevelDetailsProjection[]> {
        const { studentId, studentLevelId } = props;

        const currentContracts = await this.repository.getStudentContracts(studentId);

        const targetProjection = currentContracts.find((contract) => contract.id === studentLevelId);

        if (!targetProjection) {
            throw CustomError.notFound("Target level not found");
        }

        if (targetProjection.status !== studentModuleStatus.Active) {
            throw CustomError.badRequest("You can only finish active levels");
        }

        this.validatePreviousLevels({ currentContracts, targetModuleLevel: targetProjection.module.mo_level });

        return currentContracts;
    }

    private validatePreviousLevels(props: ValidatePreviousLevelsProps): void {
        const { currentContracts, targetModuleLevel } = props;

        const previousLevelsApproved = currentContracts.filter((contract) => contract.module.mo_level < targetModuleLevel);

        const isAllPreviousLevelsApproved = previousLevelsApproved.every((contract) => contract.status === studentModuleStatus.Approved);

        if (!isAllPreviousLevelsApproved) {
            throw CustomError.badRequest("Previous levels are not approved");
        }
    }

    private async validateCurrentContractsEntities(props: CurrentContractsEntitiesProps): Promise<CurrentContractsEntitiesResponse> {
        const { currentContracts, studentLevelId } = props;

        const currentContractsEntities = this.repository.buildContractEntities(currentContracts);

        const targetEntity = currentContractsEntities.find((entity) => entity.id === studentLevelId);

        if (!targetEntity) {
            throw CustomError.notFound("Target level entity not found");
        }

        return { currentContractsEntities, targetEntity };
    }

    private processSelfHealing(props: ProcessSelfHealingProps): StudentLevelEntity[] {
        const { currentContractsEntities, targetEntity } = props;

        targetEntity.updateStatus(studentModuleStatus.Approved);

        const allContractsCombined = currentContractsEntities.sort(
            (firstContract, secondContract) => firstContract.moduleLevel - secondContract.moduleLevel,
        );

        const contractsToUpdate = this.levelProgressionDomainService.applySelfHealing(allContractsCombined);

        const finalContractsToUpdate = [...contractsToUpdate];
        if (!finalContractsToUpdate.some((c) => c.id === targetEntity.id)) {
            finalContractsToUpdate.push(targetEntity);
        }

        return finalContractsToUpdate;
    }
}
