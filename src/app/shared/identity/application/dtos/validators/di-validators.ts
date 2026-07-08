import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { loginUserSchema } from "@/app/shared/identity/application/dtos/validators/schemas/valibot/login-user.schema";
import { registerUserSchema } from "@/app/shared/identity/application/dtos/validators/schemas/valibot/register-user.schema";
import { updateUserSchema } from "@/app/shared/identity/application/dtos/validators/schemas/valibot/update-user.schema";
import { IdentityValidatorsImpl } from "@/app/shared/identity/application/dtos/validators/validator";
import type { LoginUserProps } from "@/app/shared/identity/application/dtos/interfaces/login-user.interface";
import type { RegisterUserProps } from "@/app/shared/identity/application/dtos/interfaces/register-user.interface";
import type { UpdateUserProps } from "@/app/shared/identity/application/dtos/interfaces/update-user.interface";

const loginUserValidator = createValidator<LoginUserProps>(loginUserSchema);
const registerUserValidator = createValidator<RegisterUserProps>(registerUserSchema);
const updateUserValidator = createValidator<UpdateUserProps>(updateUserSchema);

export const identityValidators = new IdentityValidatorsImpl(loginUserValidator, registerUserValidator, updateUserValidator);
