import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

import type { CreateModuleProps } from "@/app/admin-desk/modules/application/dtos/interfaces/create-module.interface";
import type { UpdateModuleProps } from "@/app/admin-desk/modules/application/dtos/interfaces/update-module.interface";
import type { ModuleValidators } from "@/app/admin-desk/modules/application/dtos/validators/interfaces/module-validators.interface";

export class ModuleValidatorsImpl implements ModuleValidators {
    public constructor(
        public readonly createModuleValidator: EntityValidator<CreateModuleProps>,
        public readonly updateModuleValidator: EntityValidator<UpdateModuleProps>,
    ) {}
}
