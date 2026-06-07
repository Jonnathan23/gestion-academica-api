import { Validators } from "@/core/utils";

export class CreatePaymentPlanDto {
    private constructor(
        public readonly studentId: string,
        public readonly sellerId: string,
        public readonly enrollmentFee: number,
        public readonly totalAmount: number,
        public readonly isSinglePayment: boolean,
        public readonly numberOfQuotas: number,
        public readonly firstQuotaDueDate: Date,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreatePaymentPlanDto?] {
        const { studentId, sellerId, enrollmentFee, totalAmount, isSinglePayment, numberOfQuotas, firstQuotaDueDate } = object;

        if (!studentId || !Validators.IsUUID(studentId)) return ["Invalid or missing studentId"];
        if (!sellerId || !Validators.IsUUID(sellerId)) return ["Invalid or missing sellerId"];

        if (enrollmentFee === undefined || enrollmentFee < 0) return ["enrollmentFee must be 0 or greater"];
        if (!totalAmount || totalAmount <= 0) return ["totalAmount must be greater than 0"];

        if (isSinglePayment === undefined) return ["Missing isSinglePayment boolean flag"];

        const finalNumberOfQuotas = isSinglePayment ? 1 : numberOfQuotas;
        if (!finalNumberOfQuotas || finalNumberOfQuotas < 1) return ["numberOfQuotas must be at least 1"];

        if (!firstQuotaDueDate) return ["Missing firstQuotaDueDate"];
        const parsedDueDate = new Date(firstQuotaDueDate);
        if (isNaN(parsedDueDate.getTime())) return ["Invalid firstQuotaDueDate format"];

        return [
            undefined,
            new CreatePaymentPlanDto(studentId, sellerId, enrollmentFee, totalAmount, isSinglePayment, finalNumberOfQuotas, parsedDueDate),
        ];
    }
}
