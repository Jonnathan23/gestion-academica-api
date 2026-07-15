import { pipe, object, string, check, custom, optional } from "valibot";
import { Validators } from "@/core/utils/validators";

export const loginUserSchema = pipe(
    object({
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
    }),
    check((data) => data.us_email !== undefined, "Missing email"),
    check((data) => data.us_password_hash !== undefined, "Missing password"),
);
