import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { UpdateModuleProps } from "@/app/admin-desk/modules/application/dtos/interfaces/update-module.interface";

export class UpdateModuleDto {
    private constructor(
        public readonly mo_name?: string,
        public readonly mo_description?: string,
        public readonly mo_level?: number,
    ) {}

    public get values() {
        const returnObject: { [key: string]: any } = {};

        if (this.mo_name) returnObject.mo_name = this.mo_name;
        if (this.mo_description) returnObject.mo_description = this.mo_description;
        if (this.mo_level) returnObject.mo_level = this.mo_level;

        return returnObject;
    }

    public static create(object: unknown, validator: EntityValidator<UpdateModuleProps>): UpdateModuleDto {
        const data = validator.validate(object);

        return new UpdateModuleDto(data.mo_name, data.mo_description, data.mo_level);
    }
}
