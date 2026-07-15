import { StudentInClassProjection } from "@/app/class-track/core/students/domain/projections/StudentInClass.projection";

import { CustomError } from "@/core/error/customError.error";

export class StudentInClassMapper {
    public static projectionFromDbRecord(object: { [key: string]: any }): StudentInClassProjection {
        const { at_se_id, at_se_student_id, student, at_se_session_date, at_se_entry_time, at_se_status } = object;

        if (!at_se_id || !at_se_student_id || !at_se_entry_time || !at_se_session_date || !at_se_status) {
            throw CustomError.badRequest("Missing required fields");
        }

        if (!student || !student.st_id || !student.st_full_name) {
            throw CustomError.badRequest("Missing required fields");
        }

        return new StudentInClassProjection(at_se_id, student.st_id, student.st_full_name, at_se_status, at_se_entry_time);
    }
}
