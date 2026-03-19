import type { PaymentRepository } from "@/app/AdminDesk/payments/domain/repositories/Payment.repository";

interface RevertQuotaPaymentUseCaseProps {
    execute(quotaId: string): Promise<boolean>;
}

export class RevertQuotaPaymentUseCase implements RevertQuotaPaymentUseCaseProps {

    constructor(private readonly paymentRepository: PaymentRepository) { }

    async execute(quotaId: string): Promise<boolean> {
        return await this.paymentRepository.revertQuotaPayment(quotaId);
    }
}