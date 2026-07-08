import type { DeleteStudentLevelProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/delete-student-level.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class DeleteStudentLevelDto {
    private constructor(public readonly studentLevelId: string) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<DeleteStudentLevelProps>): DeleteStudentLevelDto {
        const validatedData = validator.validate(object);

        return new DeleteStudentLevelDto(validatedData.studentLevelId);
    }
}
