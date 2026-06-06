export const userState = {
    Active: "activo",
    Inactive: "inactivo",
} as const;

export type UserState = (typeof userState)[keyof typeof userState];
