import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { CreateModuleProps } from "@/app/admin-desk/modules/application/dtos/interfaces/create-module.interface";
import type { UpdateModuleProps } from "@/app/admin-desk/modules/application/dtos/interfaces/update-module.interface";

export interface ModuleValidators {
    readonly createModuleValidator: EntityValidator<CreateModuleProps>;
    readonly updateModuleValidator: EntityValidator<UpdateModuleProps>;
}
