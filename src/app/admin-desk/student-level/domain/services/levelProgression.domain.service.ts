import { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import { studentModuleStatus } from "@/core/interfaces/Contracts.interface";

export interface LevelProgressionDomainService {
    applySelfHealing(allContracts: StudentLevelEntity[]): StudentLevelEntity[];
}

export class LevelProgressionDomainServiceImpl implements LevelProgressionDomainService {
    public applySelfHealing(allContracts: StudentLevelEntity[]): StudentLevelEntity[] {
        const contractsToUpdate: StudentLevelEntity[] = [];
        let isProgressionActive: boolean = false;

        for (const currentContract of allContracts) {
            if (!currentContract) {
                continue;
            }

            let newContractStatus = currentContract.status;

            if (isProgressionActive) {
                newContractStatus = studentModuleStatus.Locked;
            } else if (currentContract.status !== studentModuleStatus.Approved) {
                newContractStatus = studentModuleStatus.Active;
                isProgressionActive = true;
            }

            if (currentContract.status !== newContractStatus) {
                currentContract.updateStatus(newContractStatus);
                contractsToUpdate.push(currentContract);
            }
        }

        return contractsToUpdate;
    }
}
