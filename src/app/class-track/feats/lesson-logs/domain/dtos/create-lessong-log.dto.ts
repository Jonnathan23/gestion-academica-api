class LessonItemDto {
    private constructor(
        public readonly lessonNumber: number,
        public readonly oralPracticeScore: number | null,
        public readonly isCompleted: boolean,
    ) {}

    public static create(object: Record<string, unknown>): [string?, LessonItemDto?] {
        const { lessonNumber, oralPracticeScore, isCompleted } = object;

        if (typeof lessonNumber !== "number" || lessonNumber <= 0) {
            return ["Invalid lesson number", undefined];
        }

        if (typeof isCompleted !== "boolean") {
            return ["Invalid completion status", undefined];
        }

        if (isCompleted && oralPracticeScore === null) {
            return ["Score is required for completed lessons", undefined];
        }

        if (oralPracticeScore !== null) {
            if (typeof oralPracticeScore !== "number") {
                return ["Invalid score format", undefined];
            }
            if (oralPracticeScore < 0 || oralPracticeScore > 100) {
                return ["Score must be between 0 and 100", undefined];
            }
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
            return ["Invalid attendance session", undefined];
        }

        if (!Array.isArray(lessonsStudied) || lessonsStudied.length === 0) {
            return ["Lessons are required", undefined];
        }

        if (lessonsStudied.length > 3) {
            return ["Maximum 3 lessons allowed", undefined];
        }

        const validLessons: LessonItemDto[] = [];

        for (const lesson of lessonsStudied) {
            const [error, lessonDto] = LessonItemDto.create(lesson as Record<string, unknown>);

            if (error || !lessonDto) {
                return [error, undefined];
            }
            validLessons.push(lessonDto);
        }

        if (validLessons.length > 1) {
            validLessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
        }

        if (validLessons.length > 1) {
            for (let i = 0; i < validLessons.length - 1; i++) {
                const prevLesson = validLessons[i]!;

                if (!prevLesson.isCompleted) {
                    return [`Lesson ${prevLesson.lessonNumber} must be completed first`, undefined];
                }
            }
        }

        const lastLesson = validLessons[validLessons.length - 1]!;

        if (!lastLesson.isCompleted && lastLesson.oralPracticeScore !== null) {
            return ["Incomplete lessons cannot have a score", undefined];
        }

        return [undefined, new CreateLessonLogsDto(attendanceSessionId, validLessons)];
    }
}
