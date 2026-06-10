import { LevelActiveForStudentProjection } from "@/app/class-track/core/students/domain/projections/student-levels/LevelActiveForStudent.projection";
import { CustomError } from "@/core/error/customError.error";

export class LevelActiveMapper {
    public static entityFromObject(object: { [key: string]: any }): LevelActiveForStudentProjection {
        const { st_mod_module_id, st_mod_status, st_mod_freeze_count, st_mod_reactivation_count } = object;

        if (st_mod_module_id == null || st_mod_status == null || st_mod_freeze_count == null || st_mod_reactivation_count == null) {
            throw CustomError.internalServer("Missing required fields");
        }

        return new LevelActiveForStudentProjection(st_mod_module_id, st_mod_status, st_mod_freeze_count, st_mod_reactivation_count);
    }

    public static arrayFromObject(object: { [key: string]: any }): LevelActiveForStudentProjection[] {
        return object.map((item: { [key: string]: any }) => this.entityFromObject(item));
    }
}
