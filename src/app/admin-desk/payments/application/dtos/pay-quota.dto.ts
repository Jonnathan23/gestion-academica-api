import { paymentMethod, type PaymentMethod } from "@/app/admin-desk/payments/domain/interfaces/payment-method.interface";
import { Validators } from "@/core/utils/validators";

export class PayQuotaDto {
    private constructor(
        public readonly quotaId: string,
        public readonly amountPaid: number,
        public readonly paymentMethod: PaymentMethod,
    ) {}

    public static create(object: { [key: string]: any }): [string?, PayQuotaDto?] {
        const { quotaId, amountPaid, paymentMethod: method } = object;

        if (!quotaId || !Validators.isUUID(quotaId)) return ["Invalid or missing quotaId"];

        if (!amountPaid || amountPaid <= 0) return ["amountPaid must be greater than 0"];

        if (!method || !Object.values(paymentMethod).includes(method as any)) {
            return ["Invalid paymentMethod. Must be CASH, TRANSFER, CreditCard or MIXED"];
        }

        return [undefined, new PayQuotaDto(quotaId, amountPaid, method)];
    }
}
