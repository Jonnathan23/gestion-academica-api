import * as v from "valibot";

export const updateModuleSchema = v.pipe(
    v.object({
        mo_name: v.optional(v.string()),
        mo_description: v.optional(v.string()),
        mo_level: v.optional(
            v.pipe(
                v.unknown(),
                v.transform((input) => Number(input)),
                v.number(),
                v.minValue(1, "Level must be greater than 0"),
                v.maxValue(6, "Level must be less than or equal to 6"),
            ),
        ),
    }),
    v.check((data) => Object.values(data).some((val) => val !== undefined), "Missing fields"),
);
