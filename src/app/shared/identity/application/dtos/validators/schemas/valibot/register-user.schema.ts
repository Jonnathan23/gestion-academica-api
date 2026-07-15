import { pipe, object, string, check, custom, optional } from "valibot";
import { Validators } from "@/core/utils/validators";

export const registerUserSchema = pipe(
    object({
        us_full_name: optional(string("Missing name")),
        us_email: optional(
            pipe(
                string("Missing email"),
                custom((val) => Validators.isEmail(val as string), "Invalid email"),
            ),
        ),
        us_password_hash: optional(
            pipe(
                string("Missing password"),
                custom((val) => Validators.isStrongPassword(val as string), "Invalid password"),
            ),
        ),
        us_role: optional(
            pipe(
                string("Missing role"),
                custom((val) => Validators.isRole(val as string), "Invalid role"),
            ),
        ),
    }),
    check((data) => data.us_full_name !== undefined, "Missing name"),
    check((data) => data.us_email !== undefined, "Missing email"),
    check((data) => data.us_password_hash !== undefined, "Missing password"),
    check((data) => data.us_role !== undefined, "Missing role"),
);
