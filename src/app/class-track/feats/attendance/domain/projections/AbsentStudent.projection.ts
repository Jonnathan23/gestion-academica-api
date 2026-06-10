import type { StudentEntity } from "@/app/admin-desk/students/domain";

export const absentStudentRelationFields: readonly (keyof StudentEntity)[] = [
    "id",
    "identificationCard",
    "fullName",
    "phoneNumber",
    "email",
] as const;

export type AbsentStudentRelation = Pick<StudentEntity, (typeof absentStudentRelationFields)[number]>;

export class AbsentStudentProjection {
    constructor(
        public readonly student: AbsentStudentRelation,
        public readonly daysAbsent: number,
        public readonly lastAttendanceDate: Date,
    ) {}
}
