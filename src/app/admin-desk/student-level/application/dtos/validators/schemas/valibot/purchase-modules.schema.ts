import { pipe, object, string, check, custom, array, minLength } from "valibot";
import { Validators } from "@/core/utils/validators";

export const purchaseModulesSchema = pipe(
    object({
        studentId: pipe(
            string("Missing student"),
            custom((val) => Validators.isUUID(val as string), "Invalid student"),
        ),
        sellerId: pipe(
            string("Missing seller"),
            custom((val) => Validators.isUUID(val as string), "Invalid seller"),
        ),
        moduleIds: pipe(
            array(string()),
            minLength(1, "module must be a non-empty array"),
            custom((arr) => {
                const uniqueModuleIds = new Set(arr as string[]);

                return uniqueModuleIds.size === (arr as string[]).length;
            }, "moduleIds array contains duplicate values"),
            custom((arr) => {
                for (const currentModuleId of arr as string[]) {
                    if (!Validators.isUUID(currentModuleId)) {
                        return false;
                    }
                }

                return true;
            }, "Invalid moduleId format"),
        ),
    }),
    check((data) => data.studentId !== undefined, "Missing student"),
    check((data) => data.sellerId !== undefined, "Missing seller"),
    check((data) => data.moduleIds !== undefined, "module must be a non-empty array"),
);
