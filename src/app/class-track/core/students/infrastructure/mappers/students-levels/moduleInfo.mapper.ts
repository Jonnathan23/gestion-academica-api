import { CustomError } from "@/core/error/customError.error";

import type { ModuleInfo } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActiveDetails.projection";

export class ModuleInfoMapper {
    public static entityFromObject(object: { [key: string]: any }): ModuleInfo {
        const { mo_id, mo_name, mo_level } = object;

        if (mo_id == null || mo_name == null || mo_level == null) {
            throw CustomError.internalServer("Missing required fields in module");
        }

        return {
            moId: mo_id,
            moName: mo_name,
            moLevel: mo_level,
        };
    }
}
