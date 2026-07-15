import { z } from "zod";

export const updateModuleSchema = z
    .object({
        mo_name: z.string().optional(),
        mo_description: z.string().optional(),
        mo_level: z.coerce.number().min(1, "Level must be greater than 0").max(6, "Level must be less than or equal to 6").optional(),
    })
    .refine((data) => Object.values(data).some((val) => val !== undefined), {
        message: "Missing fields",
    });
