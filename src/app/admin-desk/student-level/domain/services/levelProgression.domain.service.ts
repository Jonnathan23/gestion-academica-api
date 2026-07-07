import { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/student-level.entity";
import { studentModuleStatus } from "@/core/interfaces/contracts.interface";

export interface LevelProgressionDomainService {
    applySelfHealing(studentLevels: StudentLevelEntity[]): StudentLevelEntity[];
}

export class LevelProgressionDomainServiceImpl implements LevelProgressionDomainService {
    public applySelfHealing(studentLevels: StudentLevelEntity[]): StudentLevelEntity[] {
        const levelsToUpdate: StudentLevelEntity[] = [];
        let isProgressionActive: boolean = false;

        for (const currentStudentLevel of studentLevels) {
            if (!currentStudentLevel) {
                continue;
            }

            let newLevelStatus = currentStudentLevel.status;

            if (isProgressionActive) {
                newLevelStatus = studentModuleStatus.Locked;
            } else if (currentStudentLevel.status !== studentModuleStatus.Approved) {
                newLevelStatus = studentModuleStatus.Active;
                isProgressionActive = true;
            }

            if (currentStudentLevel.status !== newLevelStatus) {
                currentStudentLevel.updateStatus(newLevelStatus);
                levelsToUpdate.push(currentStudentLevel);
            }
        }

        return levelsToUpdate;
    }
}
