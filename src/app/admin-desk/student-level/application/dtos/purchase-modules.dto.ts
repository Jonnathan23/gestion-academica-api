import type { PurchaseModulesProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/purchase-modules.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class PurchaseModulesDto {
    private constructor(
        public readonly studentId: string,
        public readonly sellerId: string,
        public readonly moduleIds: string[],
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<PurchaseModulesProps>): PurchaseModulesDto {
        const validatedData = validator.validate(object);

        return new PurchaseModulesDto(validatedData.studentId, validatedData.sellerId, validatedData.moduleIds);
    }
}
