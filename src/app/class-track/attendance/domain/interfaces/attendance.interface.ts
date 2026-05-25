export const attendanceSessionStatus = {
    InProgress: "IN_PROGRESS",
    PendingApproval: "PENDING_APPROVAL",
    Approved: "APPROVED",
} as const;

export type AttendanceSessionStatus = keyof typeof attendanceSessionStatus;
