import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/payment.repository";

interface RevertQuotaPaymentUseCaseProps {
    execute(quotaId: string): Promise<boolean>;
}

export class RevertQuotaPaymentUseCase implements RevertQuotaPaymentUseCaseProps {
    public constructor(private readonly paymentRepository: PaymentRepository) {}

    public async execute(quotaId: string): Promise<boolean> {
        return await this.paymentRepository.revertQuotaPayment(quotaId);
    }
}
