export const studentModuleStatus = {
    ACTIVE: "ACTIVE",
    APPROVED: "APPROVED",
    LOCKED: "LOCKED"
} as const

export type StudentModuleStatus = typeof studentModuleStatus[keyof typeof studentModuleStatus]
