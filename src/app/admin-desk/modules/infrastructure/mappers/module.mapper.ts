import { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import { CustomError } from "@/core/error";

export const ModuleMapper = {
    moduleModelToEntity(object: { [key: string]: any }): ModuleEntity {
        const { mo_id, mo_name, mo_description, mo_level, mo_created_at, mo_updated_at } = object;

        if (!mo_id || !mo_name || !mo_description || !mo_level || !mo_created_at || !mo_updated_at) {
            throw CustomError.internalServer("Invalid user model");
        }

        return new ModuleEntity(mo_id, mo_name, mo_description, mo_level, mo_created_at, mo_updated_at);
    },
};
