export const paymentPlanStatus = {
    Pending: "PENDING",
    Completed: "COMPLETED",
    Cancelled: "CANCELLED",
} as const;

export type PaymentPlanStatus = (typeof paymentPlanStatus)[keyof typeof paymentPlanStatus];
