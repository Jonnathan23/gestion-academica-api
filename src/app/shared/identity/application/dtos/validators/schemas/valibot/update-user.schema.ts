import { pipe, object, string, optional, check, custom } from "valibot";
import { Validators } from "@/core/utils/validators";

export const updateUserSchema = pipe(
    object({
        us_full_name: optional(string()),
        us_email: optional(
            pipe(
                string(),
                custom((val) => Validators.isEmail(val as string), "Invalid email"),
            ),
        ),
        us_role: optional(
            pipe(
                string(),
                custom((val) => Validators.isRole(val as string), "Invalid role"),
            ),
        ),
    }),
    check((data) => data.us_full_name !== undefined || data.us_email !== undefined || data.us_role !== undefined, "No fields to update"),
);
