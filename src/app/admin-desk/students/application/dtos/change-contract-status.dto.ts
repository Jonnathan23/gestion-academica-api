import type { StudentContractStatus } from "@/core/interfaces/students.interface";
import type { ChangeContractStatusProps } from "@/app/admin-desk/students/application/dtos/interfaces/change-contract-status.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class ChangeContractStatusDto {
    private constructor(public readonly contractStatus: StudentContractStatus) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<ChangeContractStatusProps>): ChangeContractStatusDto {
        const validatedData = validator.validate(object);

        return new ChangeContractStatusDto(validatedData.contractStatus);
    }
}
