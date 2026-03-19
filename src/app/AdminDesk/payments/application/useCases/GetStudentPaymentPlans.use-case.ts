import type { PaymentPlanEntity } from "@/app/AdminDesk/payments/domain/entities/PaymentPlanEntity";
import type { PaymentRepository } from "@/app/AdminDesk/payments/domain/repositories/Payment.repository";


interface GetStudentPaymentPlansUseCaseProps {
    execute(studentId: string): Promise<PaymentPlanEntity[]>;
}

export class GetStudentPaymentPlansUseCase implements GetStudentPaymentPlansUseCaseProps {

    constructor(private readonly paymentRepository: PaymentRepository) { }

    async execute(studentId: string): Promise<PaymentPlanEntity[]> {
        return await this.paymentRepository.getStudentPaymentPlans(studentId);
    }
}
