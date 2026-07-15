import type { CreatePaymentPlanProps } from "@/app/admin-desk/payments/application/dtos/interfaces/create-payment-plan.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

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

    public static create(object: Record<string, unknown>, validator: EntityValidator<CreatePaymentPlanProps>): CreatePaymentPlanDto {
        const validatedData = validator.validate(object);

        const finalNumberOfQuotas = validatedData.isSinglePayment ? 1 : validatedData.numberOfQuotas || 1;
        const parsedDueDate = new Date(validatedData.firstQuotaDueDate);

        return new CreatePaymentPlanDto(
            validatedData.studentId,
            validatedData.sellerId,
            validatedData.enrollmentFee,
            validatedData.totalAmount,
            validatedData.isSinglePayment,
            finalNumberOfQuotas,
            parsedDueDate,
        );
    }
}
