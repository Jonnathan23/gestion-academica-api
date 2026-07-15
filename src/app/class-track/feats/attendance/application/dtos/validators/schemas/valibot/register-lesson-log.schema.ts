import { pipe, object, string, check, optional } from "valibot";

export const registerLessonLogSchema = pipe(
    object({
        attendanceSessionId: optional(string("Missing attendanceSessionId")),
        lessonNumber: optional(string("Missing lessonNumber")),
        notes: optional(string("Missing notes")),
        activeModule: optional(string("Missing activeModule")),
    }),
    check((data) => data.attendanceSessionId !== undefined, "Missing attendanceSessionId"),
    check((data) => data.lessonNumber !== undefined, "Missing lessonNumber"),
    check((data) => data.notes !== undefined, "Missing notes"),
    check((data) => data.activeModule !== undefined, "Missing activeModule"),
);
