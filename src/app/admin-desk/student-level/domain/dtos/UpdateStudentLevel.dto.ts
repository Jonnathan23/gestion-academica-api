import { Validators } from "@/core/utils";

export class UpdateStudentLevelDto {
    private constructor(
        public readonly studentLevelId: string,
        public readonly studentId: string,
    ) {}

    public get values() {
        const returnObject: { [key: string]: any } = {};

        if (this.studentLevelId) {
            returnObject.studentLevelId = this.studentLevelId;
        }

        if (this.studentId) returnObject.studentId = this.studentId;

        return returnObject;
    }

    public static create(object: { [key: string]: any }): [string?, UpdateStudentLevelDto?] {
        const { studentLevelId, studentId } = object;

        if (!studentLevelId) return ["Missing student level ID"];
        if (!studentId) return ["Missing student ID"];

        if (!Validators.isUUID(studentLevelId)) return ["Invalid student level ID format"];
        if (!Validators.isUUID(studentId)) return ["Invalid student ID format"];

        return [undefined, new UpdateStudentLevelDto(studentLevelId, studentId)];
    }
}
