import type { PayQuotaDto } from "@/app/AdminDesk/payments/domain/dtos";
import type { PaymentQuotaEntity } from "@/app/AdminDesk/payments/domain/entities/PaymentQuotaEntity";
import type { PaymentRepository } from "@/app/AdminDesk/payments/domain/repositories/Payment.repository";

interface ProcessQuotaPaymentUseCaseProps {
    execute(dto: PayQuotaDto): Promise<PaymentQuotaEntity>;
}


export class ProcessQuotaPaymentUseCase implements ProcessQuotaPaymentUseCaseProps {

    constructor(private readonly paymentRepository: PaymentRepository) { }

    async execute(dto: PayQuotaDto): Promise<PaymentQuotaEntity> {
        return await this.paymentRepository.processQuotaPayment(dto);
    }
}