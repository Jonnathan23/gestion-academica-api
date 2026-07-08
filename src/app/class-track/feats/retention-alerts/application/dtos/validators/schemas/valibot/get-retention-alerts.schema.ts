import { pipe, object, enum_, optional, string, number, union, check, custom, boolean } from "valibot";
import { retentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";
import { studentContractStatus } from "@/data/models/admin-desk/student.model";

export const getRetentionAlertsSchema = pipe(
    object({
        status: optional(enum_(retentionAlertStatus, "Invalid status value")),
        page: optional(
            pipe(
                union([string(), number()]),
                custom((val) => {
                    const parsed = typeof val === "string" ? parseInt(val) : (val as number);

                    return !isNaN(parsed) && parsed > 0;
                }, "page parameter is required and must be a valid positive number"),
            ),
        ),
        limit: optional(
            pipe(
                union([string(), number()]),
                custom((val) => {
                    const parsed = typeof val === "string" ? parseInt(val) : (val as number);

                    return !isNaN(parsed) && parsed > 0;
                }, "limit must be a positive number"),
            ),
        ),
        studentParameter: optional(string()),
        contractStatus: optional(enum_(studentContractStatus, "Invalid contractStatus value")),
        daysAbsent: optional(
            pipe(
                union([string(), number()]),
                custom((val) => {
                    const parsed = typeof val === "string" ? parseInt(val) : (val as number);

                    return !isNaN(parsed) && parsed >= 0;
                }, "Invalid daysAbsent value"),
            ),
        ),
        isJustified: optional(union([string(), boolean()])),
    }),
    check((data) => data.page !== undefined, "page parameter is required and must be a valid positive number"),
);
