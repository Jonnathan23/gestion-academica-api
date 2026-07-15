export interface CreatePaymentPlanProps {
    studentId: string;
    sellerId: string;
    enrollmentFee: number;
    totalAmount: number;
    isSinglePayment: boolean;
    numberOfQuotas?: number;
    firstQuotaDueDate: string;
}
