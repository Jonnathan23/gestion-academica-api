import { StudentMapper } from "@/app/admin-desk/students/infrastructure/mappers/student.mapper";
import { pickFields } from "@/core/utils/objectTools";
import { CustomError } from "@/core/error/customError.error";
import {
    AbsentStudentProjection,
    absentStudentRelationFields,
} from "@/app/class-track/feats/attendance/domain/projections/AbsentStudent.projection";

export class AbsentStudentMapper {
    public static projectionFromObject(object: { [key: string]: any }, daysAbsent: number, lastAttendance: Date): AbsentStudentProjection {
        const { student } = object;

        if (!student) throw CustomError.internalServer("Student not found");

        if (typeof daysAbsent !== "number" || Number.isNaN(daysAbsent) || daysAbsent < 0) {
            throw CustomError.internalServer(`Invalid daysAbsent value: ${daysAbsent}`);
        }

        if (!(lastAttendance instanceof Date) || Number.isNaN(lastAttendance.getTime())) {
            throw CustomError.internalServer("Invalid lastAttendance date provided to mapper");
        }

        const studentEntity = StudentMapper.studentModelToEntity(student);

        return new AbsentStudentProjection(
            pickFields({ objectToFilter: studentEntity, fieldsToKeep: absentStudentRelationFields }),
            daysAbsent,
            lastAttendance,
        );
    }
}
