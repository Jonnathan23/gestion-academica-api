import { LessonLogEntity } from "@/app/class-track/attendance/domain/entities/LessonLog.entity";
import { CustomError } from "@/core/error/customError.error";

export class LessonLogMapper {
    public static entityFromObject(object: { [key: string]: any }): LessonLogEntity {
        const { le_lo_id, le_lo_attendance_session_id, le_lo_lesson_number, le_lo_notes, le_lo_created_at } = object;

        if (!le_lo_id) throw CustomError.internalServer("Mapper Error: Missing le_lo_id");
        if (!le_lo_attendance_session_id) throw CustomError.internalServer("Mapper Error: Missing le_lo_attendance_session_id");
        if (!le_lo_lesson_number) throw CustomError.internalServer("Mapper Error: Missing le_lo_lesson_number");
        if (!le_lo_notes) throw CustomError.internalServer("Mapper Error: Missing le_lo_notes");
        if (!le_lo_created_at) throw CustomError.internalServer("Mapper Error: Missing le_lo_created_at");

        return new LessonLogEntity(le_lo_id, le_lo_attendance_session_id, le_lo_lesson_number, le_lo_notes, new Date(le_lo_created_at));
    }
}
