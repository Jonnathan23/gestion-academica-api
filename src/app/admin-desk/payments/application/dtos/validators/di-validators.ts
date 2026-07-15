import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { createPaymentPlanSchema } from "@/app/admin-desk/payments/application/dtos/validators/schemas/valibot/create-payment-plan.schema";
import { payQuotaSchema } from "@/app/admin-desk/payments/application/dtos/validators/schemas/valibot/pay-quota.schema";
import { PaymentValidatorsImpl } from "@/app/admin-desk/payments/application/dtos/validators/validator";
import type { CreatePaymentPlanProps } from "@/app/admin-desk/payments/application/dtos/interfaces/create-payment-plan.interface";
import type { PayQuotaProps } from "@/app/admin-desk/payments/application/dtos/interfaces/pay-quota.interface";

const createPaymentPlanValidator = createValidator<CreatePaymentPlanProps>(createPaymentPlanSchema);
const payQuotaValidator = createValidator<PayQuotaProps>(payQuotaSchema);

export const paymentValidators = new PaymentValidatorsImpl(createPaymentPlanValidator, payQuotaValidator);
