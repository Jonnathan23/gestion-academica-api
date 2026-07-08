import { pipe, object, string, check, minLength, custom } from "valibot";

export const getStudentTimelineSchema = pipe(
    object({
        studentId: pipe(
            string("Missing studentId"),
            minLength(1, "Invalid studentId"),
            custom((val) => (val as string).trim().length > 0, "Invalid studentId"),
        ),
    }),
    check((data) => data.studentId !== undefined, "Missing studentId"),
);
