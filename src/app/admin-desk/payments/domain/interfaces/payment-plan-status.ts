export const paymentPlanStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED"
} as const;

export type PaymentPlanStatus = typeof paymentPlanStatus[keyof typeof paymentPlanStatus];