import { CustomError } from "@/core/error/customError.error";
import { StudentWithLevelActive } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActive.projection";
import { studentContractStatus } from "@/core/interfaces/students.interface";
import { LevelActiveMapper } from "@/app/class-track/core/students/infrastructure/mappers/students-levels/level-active.mapper";

export class StudentWithLevelActiveProjectionMapper {
    public static entityFromObject(object: { [key: string]: any }): StudentWithLevelActive {
        const { student, moduleActive } = object;
        const { st_id, st_full_name, st_contract_status } = student;

        const levelActiveForStudentProjections = LevelActiveMapper.entityFromObject(moduleActive);

        if (!levelActiveForStudentProjections) {
            throw CustomError.notFound("Active student profile not found");
        }

        return new StudentWithLevelActive(
            st_id,
            st_full_name,
            levelActiveForStudentProjections.levelId,
            st_contract_status === studentContractStatus.Active,
            levelActiveForStudentProjections.contractFreezeCount,
            levelActiveForStudentProjections.contractReactivationCount,
        );
    }
}
