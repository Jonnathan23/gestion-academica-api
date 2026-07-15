import type { RegisterLessonLogProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/register-lesson-log.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class RegisterLessonLogDto {
    private constructor(
        public readonly attendanceSessionId: string,
        public readonly lessonNumber: string,
        public readonly notes: string,
        public readonly activeModule: string,
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<RegisterLessonLogProps>): RegisterLessonLogDto {
        const validatedData = validator.validate(object);

        return new RegisterLessonLogDto(
            validatedData.attendanceSessionId,
            validatedData.lessonNumber,
            validatedData.notes,
            validatedData.activeModule,
        );
    }
}
