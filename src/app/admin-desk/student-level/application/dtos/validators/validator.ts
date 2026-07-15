import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { StudentLevelValidators } from "@/app/admin-desk/student-level/application/dtos/validators/interfaces/student-level-validators.interface";
import type { DeleteStudentLevelProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/delete-student-level.interface";
import type { GetStudentTimelineProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/get-student-timeline.interface";
import type { PurchaseModulesProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/purchase-modules.interface";
import type { SearchStudentsLevelsProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/search-students-levels.interface";
import type { UpdateStudentLevelProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/update-student-level.interface";

export class StudentLevelValidatorsImpl implements StudentLevelValidators {
    public constructor(
        public readonly deleteStudentLevelValidator: EntityValidator<DeleteStudentLevelProps>,
        public readonly getStudentTimelineValidator: EntityValidator<GetStudentTimelineProps>,
        public readonly purchaseModulesValidator: EntityValidator<PurchaseModulesProps>,
        public readonly searchStudentsLevelsValidator: EntityValidator<SearchStudentsLevelsProps>,
        public readonly updateStudentLevelValidator: EntityValidator<UpdateStudentLevelProps>,
    ) {}
}
