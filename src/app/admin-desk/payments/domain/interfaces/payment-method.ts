export const paymentMethod = {
    CASH: "CASH",
    TRANSFER: "TRANSFER",
    CreditCard: "CreditCard",
    MIXED: "MIXED",
} as const;

export type PaymentMethod = (typeof paymentMethod)[keyof typeof paymentMethod];
