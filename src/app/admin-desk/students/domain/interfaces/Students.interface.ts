export const studentContractStatus = {
    Active: "ACTIVE",
    Frozen: "FROZEN",
    Inactive: "INACTIVE",
} as const;

export type StudentContractStatus = (typeof studentContractStatus)[keyof typeof studentContractStatus];

export const studentProgressCategory = {
    Fast: "FAST",
    Moderate: "MODERATE",
    Slow: "SLOW",
    NotEnoughData: "NOT_ENOUGH_DATA",
} as const;

export type StudentProgressCategory = (typeof studentProgressCategory)[keyof typeof studentProgressCategory];

export const certificateType = {
    OneTonne: "ONE_TONNE",
    TOEFL: "TOEFL",
    Other: "OTHER",
} as const;

export type CertificateType = (typeof certificateType)[keyof typeof certificateType];
