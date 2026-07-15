import type { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/payment-quota.entity";
import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/payment.repository";
import { PayQuotaDto } from "@/app/admin-desk/payments/application/dtos/pay-quota.dto";

interface ProcessQuotaPaymentUseCaseProps {
    execute(dto: PayQuotaDto): Promise<PaymentQuotaEntity>;
}

export class ProcessQuotaPaymentUseCase implements ProcessQuotaPaymentUseCaseProps {
    public constructor(private readonly paymentRepository: PaymentRepository) {}

    public async execute(dto: PayQuotaDto): Promise<PaymentQuotaEntity> {
        return await this.paymentRepository.processQuotaPayment(dto);
    }
}
