import { createModuleSchema } from "@/app/admin-desk/modules/application/dtos/validators/schemas/valibot/create-module.schema";
import { updateModuleSchema } from "@/app/admin-desk/modules/application/dtos/validators/schemas/valibot/update-module.schema";
import { ModuleValidatorsImpl } from "@/app/admin-desk/modules/application/dtos/validators/validator";
import type { CreateModuleProps } from "@/app/admin-desk/modules/application/dtos/interfaces/create-module.interface";
import type { UpdateModuleProps } from "@/app/admin-desk/modules/application/dtos/interfaces/update-module.interface";
import { createValidator } from "@/core/utils/adapters/validators/di-validators";

const createModuleValidator = createValidator<CreateModuleProps>(createModuleSchema);
const updateModuleValidator = createValidator<UpdateModuleProps>(updateModuleSchema);

export const moduleValidators = new ModuleValidatorsImpl(createModuleValidator, updateModuleValidator);
