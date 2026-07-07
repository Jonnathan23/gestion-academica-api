import { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";

export const absentStudentRelationFields: readonly (keyof StudentEntity)[] = [
    "id",
    "identificationCard",
    "fullName",
    "phoneNumber",
    "email",
] as const;

export type AbsentStudentRelation = Pick<StudentEntity, (typeof absentStudentRelationFields)[number]>;

export class AbsentStudentProjection {
    public constructor(
        public readonly student: AbsentStudentRelation,
        public readonly daysAbsent: number,
        public readonly lastAttendanceDate: Date,
    ) {}
}
