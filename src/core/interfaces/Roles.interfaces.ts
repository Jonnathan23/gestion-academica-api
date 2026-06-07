export const userRoles = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    ADVISOR: "ADVISOR",
    ACADEMIC_DIRECTOR: "ACADEMIC_DIRECTOR",
} as const;

export type UserRoles = (typeof userRoles)[keyof typeof userRoles];
