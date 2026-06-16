export const userRoles = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    ADVISOR: "ADVISOR",
    academicDirector: "ACADEMIC_DIRECTOR",
} as const;

export type UserRoles = (typeof userRoles)[keyof typeof userRoles];

export const clientRoles = {
    STUDENT: "STUDENT",
} as const;

export type ClientRoles = (typeof clientRoles)[keyof typeof clientRoles];
