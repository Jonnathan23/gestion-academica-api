import { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/lesson-log.entity";
import { CustomError } from "@/core/error/customError.error";

export class LessonLogMapper {
    public static lessonLogEntityFromObject(object: { [key: string]: any }): LessonLogEntity {
        const {
            le_lo_id,
            le_lo_attendance_session_id,
            le_lo_lesson_number,
            le_lo_oral_practice_score,
            le_lo_is_completed,
            le_lo_created_at,
            le_lo_updated_at,
        } = object;

        if (!le_lo_id) throw CustomError.internalServer("Missing le_lo_id");
        if (!le_lo_attendance_session_id) throw CustomError.internalServer("Missing le_lo_attendance_session_id");
        if (!le_lo_lesson_number) throw CustomError.internalServer("Missing le_lo_lesson_number");
        if (le_lo_is_completed === undefined) throw CustomError.internalServer("Missing le_lo_is_completed");
        if (!le_lo_created_at) throw CustomError.internalServer("Missing le_lo_created_at");
        if (!le_lo_updated_at) throw CustomError.internalServer("Missing le_lo_updated_at");

        return new LessonLogEntity(
            le_lo_id,
            le_lo_attendance_session_id,
            le_lo_lesson_number,
            le_lo_oral_practice_score !== undefined ? +le_lo_oral_practice_score : null,
            le_lo_is_completed,
            le_lo_created_at,
            le_lo_updated_at,
        );
    }
}
