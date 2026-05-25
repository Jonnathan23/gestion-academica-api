export class PaymentQuotaEntity {
    constructor(
        public id: string,
        public paymentPlanId: string,
        public quotaNumber: number,
        public paymentMethod: string | null,
        public baseAmount: number,
        public rolloverDebt: number,
        public totalExpected: number,
        public amountPaid: number,
        public dueDate: Date,
        public status: string,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}
}
