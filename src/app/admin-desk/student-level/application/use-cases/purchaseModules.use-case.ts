import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import type { PurchaseModulesDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";
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
    constructor(private readonly repository: StudentLevelRepository) {}

    public async execute(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        const { studentId, moduleIds } = dto;

        const { currentContracts, modulesToPurchase } = await this.fetchDataToValidate({ studentId, moduleIds });

        const { currentLevels, modulesToPurchaseLevels } = await this.validateModuleAlreadyPurchased({
            currentContracts,
            modulesToPurchase,
        });

        await this.validateLevelsProgress({ currentLevels, modulesToPurchaseLevels });

        return this.repository.purchaseModules(dto);
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
            expectedNextLevel++;
        }
    }

    private async fetchDataToValidate(props: FetchDataToValidateProps): Promise<FetchDataToValidateReturns> {
        const { studentId, moduleIds } = props;

        const currentContracts = await this.repository.getStudentContracts(studentId);
        const modulesToPurchase = await this.repository.getModulesByIds(moduleIds);

        return { currentContracts, modulesToPurchase };
    }
}
