import { pipe, object, optional, string, unknown, transform, number, minValue, maxValue, check } from "valibot";

const minLevel = 1;
const maxLevel = 6;

export const updateModuleSchema = pipe(
    object({
        mo_name: optional(string()),
        mo_description: optional(string()),
        mo_level: optional(
            pipe(
                unknown(),
                transform((input) => Number(input)),
                number(),
                minValue(minLevel, `Level must be greater than ${minLevel}`),
                maxValue(maxLevel, `Level must be less than or equal to ${maxLevel}`),
            ),
        ),
    }),
    check((data) => Object.values(data).some((val) => val !== undefined), "Missing fields"),
);
