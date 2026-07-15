import type { GetStudentTimelineProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/get-student-timeline.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class GetStudentTimelineDto {
    private constructor(public readonly studentId: string) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<GetStudentTimelineProps>): GetStudentTimelineDto {
        const validatedData = validator.validate(object);

        return new GetStudentTimelineDto(validatedData.studentId);
    }
}
