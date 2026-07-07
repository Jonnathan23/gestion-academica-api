import type { CreatePaymentPlanDto, PayQuotaDto } from "@/app/admin-desk/payments/domain/dtos";
import type { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/payment-plan.entity";
import type { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/payment-quota.entity";

export abstract class PaymentDataSource {
    public abstract createPaymentPlan(dto: CreatePaymentPlanDto, generatedQuotas: PaymentQuotaEntity[]): Promise<PaymentPlanEntity>;

    public abstract getStudentPaymentPlans(studentId: string): Promise<PaymentPlanEntity[]>;

    public abstract processQuotaPayment(dto: PayQuotaDto): Promise<PaymentQuotaEntity>;

    public abstract revertQuotaPayment(quotaId: string): Promise<boolean>;
}
