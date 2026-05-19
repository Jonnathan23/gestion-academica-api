import type { DtoParameters } from "@/core/types/parameters.type";
import { Validators } from "@/core/utils";

interface PurchaseModulesDtoProps extends Record<string, unknown> {
    studentId: string;
    sellerId: string;
    moduleIds: string[];
}

export class PurchaseModulesDto {
    private constructor(
        public readonly studentId: string,
        public readonly sellerId: string,
        public readonly moduleIds: string[],
    ) {}

    static create(object: DtoParameters<PurchaseModulesDtoProps>): [string?, PurchaseModulesDto?] {
        const { studentId, sellerId, moduleIds } = object;

        if (!studentId) return ["Missing student"];
        if (!sellerId) return ["Missing seller"];
        if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) return ["module must be a non-empty array"];

        if (!Validators.IsUUID(studentId)) return ["Invalid student"];
        if (!Validators.IsUUID(sellerId)) return ["Invalid seller"];

        const uniqueModuleIds = new Set(moduleIds);
        if (uniqueModuleIds.size !== moduleIds.length) {
            return ["moduleIds array contains duplicate values"];
        }

        for (const currentModuleId of moduleIds) {
            if (!Validators.IsUUID(currentModuleId)) {
                return [`Invalid moduleId format`];
            }
        }

        return [undefined, new PurchaseModulesDto(studentId, sellerId, moduleIds)];
    }
}
