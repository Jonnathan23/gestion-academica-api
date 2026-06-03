import { StudentMapper } from "@/app/admin-desk/students/infrastructure/mappers/student.mapper";
import { pickFields } from "@/core/utils/object-tools";
import { CustomError } from "@/core/error/customError.error";
import {
    AbsentStudentProjection,
    absentStudentRelationFields,
} from "@/app/class-track/attendance/domain/projections/AbsentStudent.projection";

export class AbsentStudentMapper {
    public static projectionFromObject(object: { [key: string]: any }, daysAbsent: number, lastAttendance: Date): AbsentStudentProjection {
        const { student } = object;

        if (!student) throw CustomError.internalServer("Student not found");

        const studentEntity = StudentMapper.studentModelToEntity(student);

        return new AbsentStudentProjection(
            pickFields({ objectToFilter: studentEntity, fieldsToKeep: absentStudentRelationFields }),
            daysAbsent,
            lastAttendance,
        );
    }
}
