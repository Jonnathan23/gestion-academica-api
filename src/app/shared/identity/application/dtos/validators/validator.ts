import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { IdentityValidators } from "@/app/shared/identity/application/dtos/validators/interfaces/identity-validators.interface";
import type { LoginUserProps } from "@/app/shared/identity/application/dtos/interfaces/login-user.interface";
import type { RegisterUserProps } from "@/app/shared/identity/application/dtos/interfaces/register-user.interface";
import type { UpdateUserProps } from "@/app/shared/identity/application/dtos/interfaces/update-user.interface";

export class IdentityValidatorsImpl implements IdentityValidators {
    public constructor(
        public readonly loginUserValidator: EntityValidator<LoginUserProps>,
        public readonly registerUserValidator: EntityValidator<RegisterUserProps>,
        public readonly updateUserValidator: EntityValidator<UpdateUserProps>,
    ) {}
}
