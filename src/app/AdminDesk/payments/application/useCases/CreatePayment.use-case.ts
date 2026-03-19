import type { CreatePaymentPlanDto } from "@/app/AdminDesk/payments/domain/dtos";
import { PaymentPlanEntity } from "@/app/AdminDesk/payments/domain/entities/PaymentPlanEntity";
import { paymentPlanStatus } from "@/app/AdminDesk/payments/domain/interfaces";
import type { PaymentRepository } from "@/app/AdminDesk/payments/domain/repositories/Payment.repository";

interface CreatePaymentPlanUseCaseProps {
    execute(dto: CreatePaymentPlanDto): Promise<PaymentPlanEntity>;
}

export class CreatePaymentPlanUseCase implements CreatePaymentPlanUseCaseProps {
    
    constructor(private readonly paymentRepository: PaymentRepository) { }

    async execute(dto: CreatePaymentPlanDto): Promise<PaymentPlanEntity> {
        const paymentPlan = new PaymentPlanEntity(
            "",
            dto.studentId,
            dto.sellerId,
            dto.enrollmentFee,
            dto.totalAmount,
            dto.isSinglePayment,
            paymentPlanStatus.PENDING
        );

        const generatedQuotas = paymentPlan.generateQuotas(
            dto.firstQuotaDueDate,
            dto.numberOfQuotas
        );

        return await this.paymentRepository.createPaymentPlan(dto, generatedQuotas);
    }
}