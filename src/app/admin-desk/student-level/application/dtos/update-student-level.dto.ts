import type { UpdateStudentLevelProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/update-student-level.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class UpdateStudentLevelDto {
    private constructor(
        public readonly studentLevelId: string,
        public readonly studentId: string,
    ) {}

    public get values() {
        const returnObject: Record<string, unknown> = {};

        if (this.studentLevelId) {
            returnObject.studentLevelId = this.studentLevelId;
        }

        if (this.studentId) returnObject.studentId = this.studentId;

        return returnObject;
    }

    public static create(object: Record<string, unknown>, validator: EntityValidator<UpdateStudentLevelProps>): UpdateStudentLevelDto {
        const validatedData = validator.validate(object);

        return new UpdateStudentLevelDto(validatedData.studentLevelId, validatedData.studentId);
    }
}
