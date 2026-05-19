export const paymentQuotaStatus = {
    Pending: "PENDING",
    Partial: "PARTIAL",
    Paid: "PAID",
    Overdue: "OVERDUE",
} as const;

export type PaymentQuotaStatus = (typeof paymentQuotaStatus)[keyof typeof paymentQuotaStatus];
