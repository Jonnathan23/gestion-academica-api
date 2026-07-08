import { pipe, object, string, check, custom } from "valibot";
import { Validators } from "@/core/utils/validators";

export const updateStudentLevelSchema = pipe(
    object({
        studentLevelId: pipe(
            string("Missing student level ID"),
            custom((val) => Validators.isUUID(val as string), "Invalid student level ID format"),
        ),
        studentId: pipe(
            string("Missing student ID"),
            custom((val) => Validators.isUUID(val as string), "Invalid student ID format"),
        ),
    }),
    check((data) => data.studentLevelId !== undefined, "Missing student level ID"),
    check((data) => data.studentId !== undefined, "Missing student ID"),
);
