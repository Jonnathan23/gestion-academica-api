import { pipe, object, string, check, custom, optional } from "valibot";
import { Validators } from "@/core/utils/validators";

export const approveAttendanceSessionSchema = pipe(
    object({
        sessionId: optional(
            pipe(
                string("Invalid session"),
                custom((val) => Validators.isUUID(val as string), "Invalid session"),
            ),
        ),
        teacherId: optional(
            pipe(
                string("Missing teacher"),
                custom((val) => Validators.isUUID(val as string), "Invalid teacher"),
            ),
        ),
    }),
    check((data) => data.sessionId !== undefined, "Invalid session"),
    check((data) => data.teacherId !== undefined, "Missing teacher"),
);
