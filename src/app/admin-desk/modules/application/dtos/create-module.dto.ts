import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { CreateModuleProps } from "@/app/admin-desk/modules/application/dtos/interfaces/create-module.interface";

export class CreateModuleDto {
    private constructor(
        public readonly mo_name: string,
        public readonly mo_description: string,
        public readonly mo_level: number,
    ) {}

    public static create(object: unknown, validator: EntityValidator<CreateModuleProps>): CreateModuleDto {
        const data = validator.validate(object);

        return new CreateModuleDto(data.mo_name, data.mo_description, data.mo_level);
    }
}
