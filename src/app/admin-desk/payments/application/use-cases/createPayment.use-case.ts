import type { CreatePaymentPlanDto } from "@/app/admin-desk/payments/domain/dtos";
import { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/PaymentPlanEntity";
import { paymentPlanStatus } from "@/app/admin-desk/payments/domain/interfaces";
import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/payment.repository";

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
