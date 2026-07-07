import type { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/payment-plan.entity";
import type { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/payment-quota.entity";
import { CreatePaymentPlanDto } from "@/app/admin-desk/payments/domain/dtos/create-payment-plan.dto";
import { PayQuotaDto } from "@/app/admin-desk/payments/domain/dtos/pay-quota.dto";

export abstract class PaymentRepository {
    public abstract createPaymentPlan(dto: CreatePaymentPlanDto, generatedQuotas: PaymentQuotaEntity[]): Promise<PaymentPlanEntity>;
    public abstract getStudentPaymentPlans(studentId: string): Promise<PaymentPlanEntity[]>;
    public abstract processQuotaPayment(dto: PayQuotaDto): Promise<PaymentQuotaEntity>;
    public abstract revertQuotaPayment(quotaId: string): Promise<boolean>;
}
