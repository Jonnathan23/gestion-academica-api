import type { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/payment-plan.entity";
import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/payment.repository";

interface GetStudentPaymentPlansUseCaseProps {
    execute(studentId: string): Promise<PaymentPlanEntity[]>;
}

export class GetStudentPaymentPlansUseCase implements GetStudentPaymentPlansUseCaseProps {
    public constructor(private readonly paymentRepository: PaymentRepository) {}

    public async execute(studentId: string): Promise<PaymentPlanEntity[]> {
        return await this.paymentRepository.getStudentPaymentPlans(studentId);
    }
}
