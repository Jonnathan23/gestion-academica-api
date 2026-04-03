export const studentContractStatus = {
    ACTIVE: "ACTIVE",
    FROZEN: "FROZEN",
    INACTIVE: "INACTIVE"
} as const

export type StudentContractStatus = typeof studentContractStatus[keyof typeof studentContractStatus]

export const studentProgressCategory = {
    FAST: "FAST",
    MODERATE: "MODERATE",
    SLOW: "SLOW",
    NOT_ENOUGH_DATA: "NOT_ENOUGH_DATA"
} as const

export type StudentProgressCategory = typeof studentProgressCategory[keyof typeof studentProgressCategory]


export const certificateType = {
    ONE_TONNE: "ONE_TONNE",
    TOEFL: "TOEFL",
    OTHER: "OTHER"
} as const;

export type CertificateType = typeof certificateType[keyof typeof certificateType];