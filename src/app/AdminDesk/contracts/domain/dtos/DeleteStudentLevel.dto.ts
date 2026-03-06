import { Validators } from "@/core/utils";

export class DeleteStudentLevelDto {
    private constructor(
        public readonly studentLevelId: string
    ) { }

    static create(object: { [key: string]: any }): [string?, DeleteStudentLevelDto?] {
        const { studentLevelId } = object;

        if (!studentLevelId) return ['Missing studentLevelId'];

        if (!Validators.IsUUID(studentLevelId)) return ['Invalid studentLevelId format'];

        return [undefined, new DeleteStudentLevelDto(studentLevelId)];
    }
}
