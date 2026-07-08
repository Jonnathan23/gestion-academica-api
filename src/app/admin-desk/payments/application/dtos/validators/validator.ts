import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { PaymentValidators } from "@/app/admin-desk/payments/application/dtos/validators/interfaces/payment-validators.interface";
import type { CreatePaymentPlanProps } from "@/app/admin-desk/payments/application/dtos/interfaces/create-payment-plan.interface";
import type { PayQuotaProps } from "@/app/admin-desk/payments/application/dtos/interfaces/pay-quota.interface";

export class PaymentValidatorsImpl implements PaymentValidators {
    public constructor(
        public readonly createPaymentPlanValidator: EntityValidator<CreatePaymentPlanProps>,
        public readonly payQuotaValidator: EntityValidator<PayQuotaProps>,
    ) {}
}
