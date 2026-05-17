export const paymentMethod = {
    CASH: "CASH",
    TRANSFER: "TRANSFER",
    CREDIT_CARD: "CREDIT_CARD",
    MIXED: "MIXED"
} as const;

export type PaymentMethod = typeof paymentMethod[keyof typeof paymentMethod];