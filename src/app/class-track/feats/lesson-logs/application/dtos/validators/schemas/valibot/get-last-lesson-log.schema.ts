import { pipe, object, string, check, custom, optional } from "valibot";
import { Validators } from "@/core/utils/validators";

export const getLastLessonLogSchema = pipe(
    object({
        studentId: optional(
            pipe(
                string("studentId is missing or invalid"),
                custom((val) => Validators.isUUID(val as string), "studentId must be a valid UUID"),
            ),
        ),
    }),
    check((data) => data.studentId !== undefined, "studentId is missing or invalid"),
);
