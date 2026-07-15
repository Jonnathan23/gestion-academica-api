import { z } from "zod";

export const createModuleSchema = z.object({
    mo_name: z.string({ message: "Missing name" }).min(1, "Missing name"),
    mo_description: z.string({ message: "Missing description" }).min(1, "Missing description"),
    mo_level: z.coerce
        .number({
            message: "Missing level",
        })
        .min(1, "Level must be greater than 0")
        .max(6, "Level must be less than or equal to 6"),
});
