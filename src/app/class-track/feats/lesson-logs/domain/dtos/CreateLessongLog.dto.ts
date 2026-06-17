class LessonItemDto {
    private constructor(
        public readonly lessonNumber: number,
        public readonly oralPracticeScore: number | null,
        public readonly isCompleted: boolean,
    ) {}

    public static create(object: Record<string, unknown>): [string?, LessonItemDto?] {
        const { lessonNumber, oralPracticeScore, isCompleted } = object;

        if (typeof lessonNumber !== "number" || lessonNumber <= 0) {
            return ["lessonNumber must be a positive integer", undefined];
        }

        if (oralPracticeScore !== null && typeof oralPracticeScore !== "number") {
            return ["oralPracticeScore must be a number or null", undefined];
        }

        if (typeof isCompleted !== "boolean") {
            return ["isCompleted must be a boolean", undefined];
        }

        return [undefined, new LessonItemDto(lessonNumber, oralPracticeScore, isCompleted)];
    }
}

export class CreateLessonLogsDto {
    private constructor(
        public readonly attendanceSessionId: string,
        public readonly lessonsStudied: LessonItemDto[],
    ) {}

    public static create(object: Record<string, unknown>): [string?, CreateLessonLogsDto?] {
        const { attendanceSessionId, lessonsStudied } = object;

        if (!attendanceSessionId || typeof attendanceSessionId !== "string") {
            return ["attendanceSessionId is missing or invalid", undefined];
        }

        if (!Array.isArray(lessonsStudied) || lessonsStudied.length === 0) {
            return ["lessonsStudied must be a non-empty array", undefined];
        }

        if (lessonsStudied.length > 3) {
            return ["A maximum of 3 lessons can be registered per session", undefined];
        }

        const validLessons: LessonItemDto[] = [];

        for (const lesson of lessonsStudied) {
            const [error, lessonDto] = LessonItemDto.create(lesson as Record<string, unknown>);
            if (error || !lessonDto) {
                return [`Invalid lesson item: ${error}`, undefined];
            }
            validLessons.push(lessonDto);
        }

        return [undefined, new CreateLessonLogsDto(attendanceSessionId, validLessons)];
    }
}
