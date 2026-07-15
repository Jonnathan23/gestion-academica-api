import { pipe, object, string, check, custom, optional, transform } from "valibot";

export const startAttendanceSessionSchema = pipe(
    object({
        studentId: optional(string("Missing student")),
        entryTime: optional(
            pipe(
                custom((val) => {
                    if (val instanceof Date) return true;
                    if (typeof val === "string") {
                        const date = new Date(val);

                        return !isNaN(date.getTime());
                    }

                    return false;
                }, "Invalid entryTime type. Expected a Date object or an ISO date string."),
                transform((val) => (val instanceof Date ? val : new Date(val as string))),
            ),
        ),
    }),
    check((data) => data.studentId !== undefined, "Missing student"),
    check((data) => data.entryTime !== undefined, "Missing entryTime"),
);
