export const retentionAlertStatus = {
    Pending: "PENDING",
    InProgress: "IN_PROGRESS",
    Resolved: "RESOLVED",
    ClosedFrozen: "CLOSED_FROZEN",
} as const;

export type RetentionAlertStatus = (typeof retentionAlertStatus)[keyof typeof retentionAlertStatus];
