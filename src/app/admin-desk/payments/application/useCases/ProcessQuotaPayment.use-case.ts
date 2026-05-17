import type { PayQuotaDto } from "@/app/admin-desk/payments/domain/dtos";
import type { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/PaymentQuotaEntity";
import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/Payment.repository";

interface ProcessQuotaPaymentUseCaseProps {
    execute(dto: PayQuotaDto): Promise<PaymentQuotaEntity>;
}


export class ProcessQuotaPaymentUseCase implements ProcessQuotaPaymentUseCaseProps {

    constructor(private readonly paymentRepository: PaymentRepository) { }

    async execute(dto: PayQuotaDto): Promise<PaymentQuotaEntity> {
        return await this.paymentRepository.processQuotaPayment(dto);
    }
}