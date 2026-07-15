import type { AttendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";
import { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/attendance-session.entity";
import { CustomError } from "@/core/error/customError.error";

export class AttendanceSessionMapper {
    public static entityFromObject(object: { [key: string]: any }): AttendanceSessionEntity {
        const {
            at_se_id,
            at_se_student_id,
            at_se_teacher_id,
            at_se_session_date,
            at_se_entry_time,
            at_se_exit_time,
            at_se_total_minutes,
            at_se_status,
        } = object;

        if (!at_se_id) throw CustomError.internalServer("Mapper Error: Missing at_se_id");
        if (!at_se_student_id) throw CustomError.internalServer("Mapper Error: Missing at_se_student_id");
        if (!at_se_session_date) throw CustomError.internalServer("Mapper Error: Missing at_se_session_date");
        if (!at_se_entry_time) throw CustomError.internalServer("Mapper Error: Missing at_se_entry_time");
        if (!at_se_status) throw CustomError.internalServer("Mapper Error: Missing at_se_status");

        return new AttendanceSessionEntity(
            at_se_id,
            at_se_student_id,
            at_se_teacher_id,
            new Date(at_se_session_date),
            new Date(at_se_entry_time),
            at_se_exit_time ? new Date(at_se_exit_time) : null,
            at_se_total_minutes,
            at_se_status as AttendanceSessionStatus,
        );
    }
}
