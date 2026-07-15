import type { UserRoles } from "@/core/interfaces/Roles.interfaces";
import type { UpdateUserProps } from "@/app/shared/identity/application/dtos/interfaces/update-user.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class UpdateUserDto {
    private constructor(
        public readonly us_full_name?: string,
        public readonly us_email?: string,
        public readonly us_role?: UserRoles,
    ) {}

    public get values() {
        const returnObject: Record<string, unknown> = {};

        if (this.us_full_name) returnObject.us_full_name = this.us_full_name;
        if (this.us_email) returnObject.us_email = this.us_email;
        if (this.us_role) returnObject.us_role = this.us_role;

        return returnObject;
    }

    public static create(object: Record<string, unknown>, validator: EntityValidator<UpdateUserProps>): UpdateUserDto {
        const validatedData = validator.validate(object);

        return new UpdateUserDto(validatedData.us_full_name, validatedData.us_email, validatedData.us_role);
    }
}
