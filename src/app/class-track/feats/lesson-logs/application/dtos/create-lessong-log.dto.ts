import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { CreateLessonLogsProps } from "@/app/class-track/feats/lesson-logs/application/dtos/interfaces/create-lesson-log.interface";

export class LessonItemDto {
    public constructor(
        public readonly lessonNumber: number,
        public readonly oralPracticeScore: number | null,
        public readonly isCompleted: boolean,
    ) {}
}

export class CreateLessonLogsDto {
    private constructor(
        public readonly attendanceSessionId: string,
        public readonly lessonsStudied: LessonItemDto[],
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<CreateLessonLogsProps>): CreateLessonLogsDto {
        const validatedData = validator.validate(object);
        const lessons = validatedData.lessonsStudied.map((l) => new LessonItemDto(l.lessonNumber, l.oralPracticeScore, l.isCompleted));

        return new CreateLessonLogsDto(validatedData.attendanceSessionId, lessons);
    }
}
