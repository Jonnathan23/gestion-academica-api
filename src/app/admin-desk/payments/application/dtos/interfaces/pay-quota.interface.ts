import type { PaymentMethod } from "@/app/admin-desk/payments/domain/interfaces/payment-method.interface";

export interface PayQuotaProps {
    quotaId: string;
    amountPaid: number;
    paymentMethod: PaymentMethod;
}
