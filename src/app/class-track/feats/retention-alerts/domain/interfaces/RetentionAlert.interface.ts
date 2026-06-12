export const retentionAlertStatus = {
    Pending: "PENDING",
    InProgress: "IN_PROGRESS",
    Resolved: "RESOLVED",
    Unresolved: "UNRESOLVED",
} as const;

export type RetentionAlertStatus = (typeof retentionAlertStatus)[keyof typeof retentionAlertStatus];
