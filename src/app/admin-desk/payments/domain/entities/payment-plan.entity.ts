import { PaymentQuotaEntity } from "./payment-quota.entity";
import { paymentQuotaStatus } from "@/app/admin-desk/payments/domain/interfaces/payment-quota-status.interface";

export class PaymentPlanEntity {
    public constructor(
        public id: string,
        public studentId: string,
        public sellerId: string,
        public enrollmentFee: number,
        public totalAmount: number,
        public isSinglePayment: boolean,
        public status: string,
        public quotas?: PaymentQuotaEntity[],
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public generateQuotas(firstDueDate: Date, numberOfQuotas: number): PaymentQuotaEntity[] {
        const generatedQuotas: PaymentQuotaEntity[] = [];
        const maxDecimals = 2;
        const baseAmountPerQuota = parseFloat((this.totalAmount / numberOfQuotas).toFixed(maxDecimals));

        for (let index = 0; index < numberOfQuotas; index++) {
            const currentDueDate = new Date(firstDueDate);

            currentDueDate.setMonth(currentDueDate.getMonth() + index);

            const quota = new PaymentQuotaEntity(
                "",
                this.id,
                index + 1,
                null,
                baseAmountPerQuota,
                0.0,
                baseAmountPerQuota,
                0.0,
                currentDueDate,
                paymentQuotaStatus.Pending,
            );

            generatedQuotas.push(quota);
        }

        this.quotas = generatedQuotas;

        return generatedQuotas;
    }
}
