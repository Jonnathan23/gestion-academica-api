import { pipe, object, enum_, check, optional } from "valibot";
import { retentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";

export const getCountAlertsSchema = pipe(
    object({
        status: optional(enum_(retentionAlertStatus, "Invalid status value")),
    }),
    check((data) => data.status !== undefined, "status is required"),
);
