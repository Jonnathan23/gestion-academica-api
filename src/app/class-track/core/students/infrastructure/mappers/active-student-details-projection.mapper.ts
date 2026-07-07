import { studentContractStatus } from "@/core/interfaces/students.interface";
import { CustomError } from "@/core/error/customError.error";

import { StudentWithLevelActiveDetails } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActiveDetails.projection";

import { LevelActiveMapper } from "@/app/class-track/core/students/infrastructure/mappers/students-levels/level-active.mapper";
import { ModuleInfoMapper } from "@/app/class-track/core/students/infrastructure/mappers/students-levels/module-info.mapper";

export class StudentWithLevelActiveDetailsProjectionMapper {
    public static entityFromObject(object: { [key: string]: any }): StudentWithLevelActiveDetails {
        const { student, moduleActive, moduleInfo } = object;
        const { st_id, st_full_name, st_contract_status } = student;

        const levelActiveForStudentProjections = LevelActiveMapper.entityFromObject(moduleActive);

        if (!levelActiveForStudentProjections) {
            throw CustomError.notFound("Active student profile not found");
        }

        const mappedModuleInfo = ModuleInfoMapper.entityFromObject(moduleInfo);

        return new StudentWithLevelActiveDetails(
            st_id,
            st_full_name,
            levelActiveForStudentProjections.levelId,
            st_contract_status === studentContractStatus.Active,
            levelActiveForStudentProjections.contractFreezeCount,
            levelActiveForStudentProjections.contractReactivationCount,
            mappedModuleInfo,
        );
    }
}
