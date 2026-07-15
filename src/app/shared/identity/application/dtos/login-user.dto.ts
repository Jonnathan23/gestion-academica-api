import type { LoginUserProps } from "@/app/shared/identity/application/dtos/interfaces/login-user.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class LoginUserDto {
    private constructor(
        public readonly us_email: string,
        public readonly us_password_hash: string,
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<LoginUserProps>): LoginUserDto {
        const validatedData = validator.validate(object);

        return new LoginUserDto(validatedData.us_email, validatedData.us_password_hash);
    }
}
