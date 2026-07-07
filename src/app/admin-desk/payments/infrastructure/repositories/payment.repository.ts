import type { PaymentDataSource } from "@/app/admin-desk/payments/domain/datasource";
import type { CreatePaymentPlanDto, PayQuotaDto } from "@/app/admin-desk/payments/domain/dtos";
import type { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/payment-plan.entity";
import type { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/payment-quota.entity";
import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/payment.repository";

export class PaymentRepositoryImpl implements PaymentRepository {
    public constructor(private readonly datasource: PaymentDataSource) {}

    public async createPaymentPlan(dto: CreatePaymentPlanDto, generatedQuotas: PaymentQuotaEntity[]): Promise<PaymentPlanEntity> {
        return this.datasource.createPaymentPlan(dto, generatedQuotas);
    }

    public async getStudentPaymentPlans(studentId: string): Promise<PaymentPlanEntity[]> {
        return this.datasource.getStudentPaymentPlans(studentId);
    }

    public async processQuotaPayment(dto: PayQuotaDto): Promise<PaymentQuotaEntity> {
        return this.datasource.processQuotaPayment(dto);
    }

    public async revertQuotaPayment(quotaId: string): Promise<boolean> {
        return this.datasource.revertQuotaPayment(quotaId);
    }
}
