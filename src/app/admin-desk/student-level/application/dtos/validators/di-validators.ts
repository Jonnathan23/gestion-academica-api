import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { deleteStudentLevelSchema } from "@/app/admin-desk/student-level/application/dtos/validators/schemas/valibot/delete-student-level.schema";
import { getStudentTimelineSchema } from "@/app/admin-desk/student-level/application/dtos/validators/schemas/valibot/get-student-timeline.schema";
import { purchaseModulesSchema } from "@/app/admin-desk/student-level/application/dtos/validators/schemas/valibot/purchase-modules.schema";
import { searchStudentsLevelsSchema } from "@/app/admin-desk/student-level/application/dtos/validators/schemas/valibot/search-students-levels.schema";
import { updateStudentLevelSchema } from "@/app/admin-desk/student-level/application/dtos/validators/schemas/valibot/update-student-level.schema";
import { StudentLevelValidatorsImpl } from "@/app/admin-desk/student-level/application/dtos/validators/validator";
import type { DeleteStudentLevelProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/delete-student-level.interface";
import type { GetStudentTimelineProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/get-student-timeline.interface";
import type { PurchaseModulesProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/purchase-modules.interface";
import type { SearchStudentsLevelsProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/search-students-levels.interface";
import type { UpdateStudentLevelProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/update-student-level.interface";

const deleteStudentLevelValidator = createValidator<DeleteStudentLevelProps>(deleteStudentLevelSchema);
const getStudentTimelineValidator = createValidator<GetStudentTimelineProps>(getStudentTimelineSchema);
const purchaseModulesValidator = createValidator<PurchaseModulesProps>(purchaseModulesSchema);
const searchStudentsLevelsValidator = createValidator<SearchStudentsLevelsProps>(searchStudentsLevelsSchema);
const updateStudentLevelValidator = createValidator<UpdateStudentLevelProps>(updateStudentLevelSchema);

export const studentLevelValidators = new StudentLevelValidatorsImpl(
    deleteStudentLevelValidator,
    getStudentTimelineValidator,
    purchaseModulesValidator,
    searchStudentsLevelsValidator,
    updateStudentLevelValidator,
);
