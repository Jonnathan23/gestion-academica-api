import { pipe, object, string, check, custom, optional, transform } from "valibot";

export const endAttendanceSessionSchema = pipe(
    object({
        sessionId: optional(string("Missing sessionId")),
        exitTime: optional(
            pipe(
                custom((val) => {
                    const date = val instanceof Date ? val : new Date(val as string | number);

                    return !isNaN(date.getTime());
                }, "Invalid exitTime. Must be a valid Date"),
                transform((val) => (val instanceof Date ? val : new Date(val as string | number))),
            ),
        ),
    }),
    check((data) => data.sessionId !== undefined, "Missing sessionId"),
    check((data) => data.exitTime !== undefined, "Invalid exitTime. Must be a valid Date"),
);
