import { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/payment-plan.entity";
import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/payment.repository";
import { CreatePaymentPlanDto } from "@/app/admin-desk/payments/domain/dtos/create-payment-plan.dto";
import { paymentPlanStatus } from "@/app/admin-desk/payments/domain/interfaces/payment-plan-status.interface";

interface CreatePaymentPlanUseCaseProps {
    execute(dto: CreatePaymentPlanDto): Promise<PaymentPlanEntity>;
}

export class CreatePaymentPlanUseCase implements CreatePaymentPlanUseCaseProps {
    public constructor(private readonly paymentRepository: PaymentRepository) {}

    public async execute(dto: CreatePaymentPlanDto): Promise<PaymentPlanEntity> {
        const paymentPlan = new PaymentPlanEntity(
            "",
            dto.studentId,
            dto.sellerId,
            dto.enrollmentFee,
            dto.totalAmount,
            dto.isSinglePayment,
            paymentPlanStatus.Pending,
        );

        const generatedQuotas = paymentPlan.generateQuotas(dto.firstQuotaDueDate, dto.numberOfQuotas);

        return await this.paymentRepository.createPaymentPlan(dto, generatedQuotas);
    }
}
