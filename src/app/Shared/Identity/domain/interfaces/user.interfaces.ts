export const userState = {
    ACTIVE: "activo",
    INACTIVE: "inactivo"
} as const;

export type UserState = typeof userState[keyof typeof userState];