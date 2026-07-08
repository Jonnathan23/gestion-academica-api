import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { CreatePaymentPlanProps } from "@/app/admin-desk/payments/application/dtos/interfaces/create-payment-plan.interface";
import type { PayQuotaProps } from "@/app/admin-desk/payments/application/dtos/interfaces/pay-quota.interface";

export interface PaymentValidators {
    createPaymentPlanValidator: EntityValidator<CreatePaymentPlanProps>;
    payQuotaValidator: EntityValidator<PayQuotaProps>;
}
