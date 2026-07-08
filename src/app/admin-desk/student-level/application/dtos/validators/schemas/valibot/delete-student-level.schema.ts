import { pipe, object, string, check, custom } from "valibot";
import { Validators } from "@/core/utils/validators";

export const deleteStudentLevelSchema = pipe(
    object({
        studentLevelId: pipe(
            string("Missing studentLevelId"),
            custom((val) => Validators.isUUID(val as string), "Invalid studentLevelId format"),
        ),
    }),
    check((data) => data.studentLevelId !== undefined, "Missing studentLevelId"),
);
