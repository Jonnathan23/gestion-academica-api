import { pipe, object, optional, string, minLength, unknown, transform, number, minValue, maxValue, check } from "valibot";

const minLevel = 1;
const maxLevel = 6;

export const createModuleSchema = pipe(
    object({
        mo_name: optional(pipe(string("Missing name"), minLength(1, "Missing name"))),
        mo_description: optional(pipe(string("Missing description"), minLength(1, "Missing description"))),
        mo_level: optional(
            pipe(
                unknown(),
                transform((input) => Number(input)),
                number("Missing level"),
                minValue(minLevel, `Level must be greater than ${minLevel}`),
                maxValue(maxLevel, `Level must be less than or equal to ${maxLevel}`),
            ),
        ),
    }),
    check((data) => data.mo_name !== undefined, "Missing name"),
    check((data) => data.mo_description !== undefined, "Missing description"),
    check((data) => data.mo_level !== undefined, "Missing level"),
);
