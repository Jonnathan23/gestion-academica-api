import * as v from "valibot";

export const createModuleSchema = v.pipe(
    v.object({
        mo_name: v.optional(v.pipe(v.string("Missing name"), v.minLength(1, "Missing name"))),
        mo_description: v.optional(v.pipe(v.string("Missing description"), v.minLength(1, "Missing description"))),
        mo_level: v.optional(
            v.pipe(
                v.unknown(),
                v.transform((input) => Number(input)),
                v.number("Missing level"),
                v.minValue(1, "Level must be greater than 0"),
                v.maxValue(6, "Level must be less than or equal to 6"),
            ),
        ),
    }),
    v.check((data) => data.mo_name !== undefined, "Missing name"),
    v.check((data) => data.mo_description !== undefined, "Missing description"),
    v.check((data) => data.mo_level !== undefined, "Missing level"),
);
