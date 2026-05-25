export const retentionAlertStatus = {
    pending: "pending",
    inProgress: "in_progress",
    resolved: "resolved",
    closedFrozen: "closed_frozen",
} as const;

export type RetentionAlertStatus = (typeof retentionAlertStatus)[keyof typeof retentionAlertStatus];
