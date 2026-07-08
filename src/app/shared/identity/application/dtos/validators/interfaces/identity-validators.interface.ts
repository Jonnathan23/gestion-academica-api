import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { LoginUserProps } from "@/app/shared/identity/application/dtos/interfaces/login-user.interface";
import type { RegisterUserProps } from "@/app/shared/identity/application/dtos/interfaces/register-user.interface";
import type { UpdateUserProps } from "@/app/shared/identity/application/dtos/interfaces/update-user.interface";

export interface IdentityValidators {
    loginUserValidator: EntityValidator<LoginUserProps>;
    registerUserValidator: EntityValidator<RegisterUserProps>;
    updateUserValidator: EntityValidator<UpdateUserProps>;
}
