import { pipe, object, string, array, number, boolean, nullable, check, custom, optional, transform } from "valibot";
import type { LessonItemProps } from "@/app/class-track/feats/lesson-logs/application/dtos/interfaces/create-lesson-log.interface";

const MAX_SCORE = 100;
const MAX_LESSONS = 3;

const lessonItemSchema = pipe(
    object({
        lessonNumber: optional(
            pipe(
                number("Invalid lesson number"),
                check((val) => val > 0, "Invalid lesson number"),
            ),
        ),
        oralPracticeScore: optional(
            nullable(
                pipe(
                    number("Invalid score format"),
                    check((val) => val >= 0 && val <= MAX_SCORE, "Score must be between 0 and 100"),
                ),
            ),
        ),
        isCompleted: optional(boolean("Invalid completion status")),
    }),
    check((data) => data.lessonNumber !== undefined, "Invalid lesson number"),
    check((data) => data.isCompleted !== undefined, "Invalid completion status"),
    check((data) => data.oralPracticeScore !== undefined, "Invalid score format"),
    check((data) => {
        if (data.isCompleted && data.oralPracticeScore === null) {
            return false;
        }

        return true;
    }, "Score is required for completed lessons"),
);

export const createLessonLogsSchema = pipe(
    object({
        attendanceSessionId: optional(string("Invalid attendance session")),
        lessonsStudied: optional(
            pipe(
                array(lessonItemSchema, "Lessons are required"),
                check((arr) => arr.length > 0, "Lessons are required"),
                check((arr) => arr.length <= MAX_LESSONS, "Maximum 3 lessons allowed"),
                transform((arr) => {
                    const sorted = [...arr].sort((a, b) => a.lessonNumber! - b.lessonNumber!);

                    return sorted;
                }),
            ),
        ),
    }),
    check((data) => (data as Record<string, unknown>).attendanceSessionId !== undefined, "Invalid attendance session"),
    check((data) => (data as Record<string, unknown>).lessonsStudied !== undefined, "Lessons are required"),
    custom(
        (data) => {
            const arr = (data as Record<string, unknown>).lessonsStudied as LessonItemProps[];

            if (arr && arr.length > 1) {
                for (let i = 0; i < arr.length - 1; i++) {
                    if (!arr[i]!.isCompleted) {
                        return false;
                    }
                }
            }

            return true;
        },
        (issue) => {
            const arr = (issue.input as Record<string, unknown>).lessonsStudied as LessonItemProps[];

            for (let i = 0; i < arr.length - 1; i++) {
                if (!arr[i]!.isCompleted) {
                    return `Lesson ${arr[i]!.lessonNumber} must be completed first`;
                }
            }

            return "Lesson must be completed first";
        },
    ),
    custom((data) => {
        const arr = (data as Record<string, unknown>).lessonsStudied as LessonItemProps[];

        if (arr && arr.length > 0) {
            const lastLesson = arr[arr.length - 1]!;

            if (!lastLesson.isCompleted && lastLesson.oralPracticeScore !== null) {
                return false;
            }
        }

        return true;
    }, "Incomplete lessons cannot have a score"),
);
