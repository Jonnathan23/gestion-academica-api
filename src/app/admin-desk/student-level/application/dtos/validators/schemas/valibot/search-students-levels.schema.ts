import { pipe, object, string, optional, unknown, transform, number, minValue } from "valibot";

export const searchStudentsLevelsSchema = object({
    searchTerm: optional(string()),
    limit: optional(
        pipe(
            unknown(),
            transform((input) => Number(input)),
            number("limit must be a positive integer"),
            minValue(1, "limit must be a positive integer"),
        ),
    ),
});
