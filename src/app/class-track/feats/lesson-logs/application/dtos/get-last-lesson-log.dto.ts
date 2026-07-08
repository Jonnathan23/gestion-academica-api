import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { GetLastLessonLogProps } from "@/app/class-track/feats/lesson-logs/application/dtos/interfaces/get-last-lesson-log.interface";

export class GetLastLessonLogDto {
    private constructor(public readonly studentId: string) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<GetLastLessonLogProps>): GetLastLessonLogDto {
        const validatedData = validator.validate(object);

        return new GetLastLessonLogDto(validatedData.studentId);
    }
}
