import type { CreatePaymentPlanDto, PayQuotaDto } from "@/app/admin-desk/payments/domain/dtos";
import type { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/PaymentPlanEntity";
import type { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/PaymentQuotaEntity";

export abstract class PaymentDataSource {
    abstract createPaymentPlan(dto: CreatePaymentPlanDto, generatedQuotas: PaymentQuotaEntity[]): Promise<PaymentPlanEntity>;

    abstract getStudentPaymentPlans(studentId: string): Promise<PaymentPlanEntity[]>;

    abstract processQuotaPayment(dto: PayQuotaDto): Promise<PaymentQuotaEntity>;

    abstract revertQuotaPayment(quotaId: string): Promise<boolean>;
}
