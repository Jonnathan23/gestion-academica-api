export const paymentQuotaStatus = {
    PENDING: "PENDING",
    PARTIAL: "PARTIAL",
    PAID: "PAID",
    OVERDUE: "OVERDUE"
} as const;

export type PaymentQuotaStatus = typeof paymentQuotaStatus[keyof typeof paymentQuotaStatus];

