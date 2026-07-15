import { pipe, object, boolean, string, optional, custom, check, union, date, number } from "valibot";

export const updateRetentionAlertSchema = pipe(
    object({
        hasResponded: optional(boolean("Invalid 'hasResponded' property")),
        isJustified: optional(boolean("Invalid 'isJustified' property")),
        observations: optional(string("Invalid 'observations' property")),
        contactDate: optional(
            pipe(
                union([string(), number(), date()]),
                custom((val) => !isNaN(new Date(val as string | number | Date).getTime()), "Invalid 'contactDate' format"),
            ),
        ),
        justificationReason: optional(string()),
        returnDeadline: optional(
            pipe(
                union([string(), number(), date()]),
                custom((val) => !isNaN(new Date(val as string | number | Date).getTime()), "Invalid 'returnDeadline' format"),
            ),
        ),
    }),
    check((data) => data.hasResponded !== undefined, "Invalid 'hasResponded' property"),
    check((data) => data.isJustified !== undefined, "Invalid 'isJustified' property"),
    check((data) => data.observations !== undefined, "Invalid 'observations' property"),
    check((data) => {
        if (data.isJustified && (!data.justificationReason || typeof data.justificationReason !== "string")) {
            return false;
        }

        return true;
    }, "'justificationReason' is required when 'isJustified' is true"),
);
