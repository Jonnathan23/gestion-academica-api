import type { PaymentMethod } from "@/app/admin-desk/payments/domain/interfaces/payment-method.interface";
import type { PayQuotaProps } from "@/app/admin-desk/payments/application/dtos/interfaces/pay-quota.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class PayQuotaDto {
    private constructor(
        public readonly quotaId: string,
        public readonly amountPaid: number,
        public readonly paymentMethod: PaymentMethod,
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<PayQuotaProps>): PayQuotaDto {
        const validatedData = validator.validate(object);

        return new PayQuotaDto(validatedData.quotaId, validatedData.amountPaid, validatedData.paymentMethod);
    }
}
