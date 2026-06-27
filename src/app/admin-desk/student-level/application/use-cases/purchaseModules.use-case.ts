import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { PurchaseModulesDto } from "@/app/admin-desk/student-level/domain/dtos";
import { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";
import type { LevelProgressionDomainService } from "@/app/admin-desk/student-level/domain/services/levelProgression.domain.service";

import { CustomError } from "@/core/error";

interface FetchDataToValidateProps {
    readonly studentId: string;
    readonly moduleIds: string[];
}

interface FetchDataToValidateReturns {
    readonly currentContracts: StudentLevelDetailsProjection[];
    readonly modulesToPurchase: ModuleEntity[];
}

interface ValidateLevelsProps {
    readonly currentContracts: StudentLevelDetailsProjection[];
    readonly modulesToPurchase: ModuleEntity[];
}

interface ValidateModuleAlreadyPurchasedReturns {
    readonly currentLevels: number[];
    readonly modulesToPurchaseLevels: number[];
}

interface ValidateCurrentLevelProps {
    readonly currentLevels: number[];
    readonly modulesToPurchaseLevels: number[];
}

export interface PurchaseModulesUseCase {
    execute(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>;
}

export class PurchaseModules implements PurchaseModulesUseCase {
    constructor(
        private readonly repository: StudentLevelRepository,
        private readonly levelProgressionDomainService: LevelProgressionDomainService,
    ) {}

    public async execute(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        const { studentId, sellerId, moduleIds } = dto;

        const { currentContracts, modulesToPurchase } = await this.fetchDataToValidate({ studentId, moduleIds });

        const { currentLevels, modulesToPurchaseLevels } = await this.validateModuleAlreadyPurchased({
            currentContracts,
            modulesToPurchase,
        });

        await this.validateLevelsProgress({ currentLevels, modulesToPurchaseLevels });

        const currentContractsEntities = this.repository.buildContractEntities(currentContracts);
        const newContractsEntities = this.repository.buildNewContractsEntities(studentId, sellerId, modulesToPurchase);

        const allContractsCombined = [...currentContractsEntities, ...newContractsEntities].sort(
            (firstContract, secondContract) => firstContract.moduleLevel - secondContract.moduleLevel,
        );

        const contractsToUpdate = this.levelProgressionDomainService.applySelfHealing(allContractsCombined);

        const savedContracts = await this.repository.saveProgressionTransaction(newContractsEntities, contractsToUpdate);

        return savedContracts;
    }

    private async fetchDataToValidate(props: FetchDataToValidateProps): Promise<FetchDataToValidateReturns> {
        const { studentId, moduleIds } = props;

        const currentContracts = await this.repository.getStudentContracts(studentId);
        const modulesToPurchase = await this.repository.getModulesByIds(moduleIds);

        return { currentContracts, modulesToPurchase };
    }

    private async validateModuleAlreadyPurchased(props: ValidateLevelsProps): Promise<ValidateModuleAlreadyPurchasedReturns> {
        const { currentContracts, modulesToPurchase } = props;

        const currentLevels = currentContracts
            .map((contract) => contract.module.mo_level)
            .sort((firstLevel, secondLevel) => firstLevel - secondLevel);

        const modulesToPurchaseLevels = modulesToPurchase
            .map((module) => module.mo_level)
            .sort((firstLevel, secondLevel) => firstLevel - secondLevel);

        for (const level of modulesToPurchaseLevels) {
            if (currentLevels.includes(level)) {
                throw CustomError.badRequest(`El estudiante ya posee el módulo de nivel ${level}`);
            }
        }

        return { currentLevels, modulesToPurchaseLevels };
    }

    private async validateLevelsProgress(props: ValidateCurrentLevelProps): Promise<void> {
        const { currentLevels, modulesToPurchaseLevels } = props;

        const maxCurrentLevel = currentLevels.length > 0 ? Math.max(...currentLevels) : 0;
        let expectedNextLevel = maxCurrentLevel + 1;

        for (const level of modulesToPurchaseLevels) {
            if (level !== expectedNextLevel) {
                throw CustomError.badRequest(
                    `El progreso de módulos es inválido. Se esperaba el nivel ${expectedNextLevel} pero se intentó adquirir el nivel ${level}`,
                );
            }
            expectedNextLevel += 1;
        }
    }
}
