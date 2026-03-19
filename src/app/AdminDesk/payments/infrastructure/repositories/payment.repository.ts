import type { PaymentDataSource } from "@/app/AdminDesk/payments/domain/datasource";
import type { CreatePaymentPlanDto, PayQuotaDto } from "@/app/AdminDesk/payments/domain/dtos";
import type { PaymentPlanEntity } from "@/app/AdminDesk/payments/domain/entities/PaymentPlanEntity";
import type { PaymentQuotaEntity } from "@/app/AdminDesk/payments/domain/entities/PaymentQuotaEntity";
import type { PaymentRepository } from "@/app/AdminDesk/payments/domain/repositories/Payment.repository";



export class PaymentRepositoryImpl implements PaymentRepository {
    
    constructor(private readonly datasource: PaymentDataSource) {}

    async createPaymentPlan(dto: CreatePaymentPlanDto, generatedQuotas: PaymentQuotaEntity[]): Promise<PaymentPlanEntity> {
        return this.datasource.createPaymentPlan(dto, generatedQuotas);
    }

    async getStudentPaymentPlans(studentId: string): Promise<PaymentPlanEntity[]> {
        return this.datasource.getStudentPaymentPlans(studentId);
    }

    async processQuotaPayment(dto: PayQuotaDto): Promise<PaymentQuotaEntity> {
        return this.datasource.processQuotaPayment(dto);
    }

    async revertQuotaPayment(quotaId: string): Promise<boolean> {
        return this.datasource.revertQuotaPayment(quotaId);
    }
}