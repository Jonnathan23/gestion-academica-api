import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/student-level.entity";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/student-level.repository";
import type { LevelProgressionDomainService } from "@/app/admin-desk/student-level/domain/services/levelProgression.domain.service";
import { CustomError } from "@/core/error/customError.error";

interface ProcessSelfHealingProps {
    readonly currentContractsEntities: StudentLevelEntity[];
    readonly studentLevelId: string;
}

export interface DeleteStudentLevelUseCase {
    execute(studentLevelId: string): Promise<boolean>;
}

export class DeleteStudentLevel implements DeleteStudentLevelUseCase {
    public constructor(
        private readonly repository: StudentLevelRepository,
        private readonly levelProgressionDomainService: LevelProgressionDomainService,
    ) {}

    public async execute(studentLevelId: string): Promise<boolean> {
        const studentId = await this.repository.getStudentIdByContract(studentLevelId);

        if (!studentId) {
            throw CustomError.notFound("Target level not found");
        }

        const currentContracts = await this.repository.getStudentContracts(studentId);

        const currentContractsEntities = this.repository.buildContractEntities(currentContracts);

        const contractsToUpdate = this.processSelfHealing({ currentContractsEntities, studentLevelId });

        return this.repository.deleteProgressionTransaction(studentLevelId, contractsToUpdate);
    }

    private processSelfHealing(props: ProcessSelfHealingProps): StudentLevelEntity[] {
        const { currentContractsEntities, studentLevelId } = props;

        const remainingEntities = currentContractsEntities.filter((entity) => entity.id !== studentLevelId);

        const allContractsCombined = remainingEntities.sort(
            (firstContract, secondContract) => firstContract.moduleLevel - secondContract.moduleLevel,
        );

        return this.levelProgressionDomainService.applySelfHealing(allContractsCombined);
    }
}
