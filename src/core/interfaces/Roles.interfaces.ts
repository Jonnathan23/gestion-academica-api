export const userRoles = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER"
} as const

export type UserRoles = typeof userRoles[keyof typeof userRoles]