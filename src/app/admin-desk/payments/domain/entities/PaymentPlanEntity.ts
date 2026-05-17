import { paymentQuotaStatus } from '@/app/admin-desk/payments/domain/interfaces';
import { PaymentQuotaEntity } from './PaymentQuotaEntity';

export class PaymentPlanEntity {

    constructor(
        public id: string,
        public studentId: string,
        public sellerId: string,
        public enrollmentFee: number,
        public totalAmount: number,
        public isSinglePayment: boolean,
        public status: string,
        public quotas?: PaymentQuotaEntity[],
        public createdAt?: Date,
        public updatedAt?: Date
    ) { }

    public generateQuotas(firstDueDate: Date, numberOfQuotas: number): PaymentQuotaEntity[] {
        const generatedQuotas: PaymentQuotaEntity[] = [];
        const baseAmountPerQuota = parseFloat((this.totalAmount / numberOfQuotas).toFixed(2));

        for (let index = 0; index < numberOfQuotas; index++) {

            const currentDueDate = new Date(firstDueDate);
            currentDueDate.setMonth(currentDueDate.getMonth() + index);

            const quota = new PaymentQuotaEntity(
                "",
                this.id,
                index + 1,
                null,
                baseAmountPerQuota,
                0.00,
                baseAmountPerQuota,
                0.00,
                currentDueDate,
                paymentQuotaStatus.PENDING
            );

            generatedQuotas.push(quota);
        }

        this.quotas = generatedQuotas;
        return generatedQuotas;
    }
}