export const studentModuleStatus = {
    Active: "ACTIVE",
    Approved: "APPROVED",
    Locked: "LOCKED",
} as const;

export type StudentModuleStatus = (typeof studentModuleStatus)[keyof typeof studentModuleStatus];
