import { pipe, object, optional, string, union, number, minLength, check } from "valibot";

const minSearchTermLength = 2;

export const searchStudentsSchema = object({
    searchTerm: pipe(
        string("searchTerm must be a string"),
        minLength(1, "Missing searchTerm parameter"),
        check(
            (val) => val.trim().length >= minSearchTermLength,
            `searchTerm must be at least ${minSearchTermLength} characters long to perform a search`,
        ),
    ),
    limit: optional(
        pipe(
            union([string(), number()]),
            check((val) => {
                const parsed = typeof val === "string" ? parseInt(val) : (val as number);

                return !isNaN(parsed) && parsed > 0;
            }, "limit must be a valid positive number"),
        ),
    ),
});
