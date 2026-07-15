import type { UserRoles } from "@/core/interfaces/Roles.interfaces";
import type { RegisterUserProps } from "@/app/shared/identity/application/dtos/interfaces/register-user.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class RegisterUserDto {
    private constructor(
        public readonly us_full_name: string,
        public readonly us_email: string,
        public readonly us_password_hash: string,
        public readonly us_role: UserRoles,
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<RegisterUserProps>): RegisterUserDto {
        const validatedData = validator.validate(object);

        return new RegisterUserDto(
            validatedData.us_full_name,
            validatedData.us_email,
            validatedData.us_password_hash,
            validatedData.us_role,
        );
    }
}
