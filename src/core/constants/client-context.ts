export const headerConstants = {
    clientContextName: "X-Client-Context",
} as const;

export const clientContextValues = {
    classTrackStudent: "class-track-student",
    salcPortal: "salc-portal",
} as const;

export type ClientContext = (typeof clientContextValues)[keyof typeof clientContextValues];
