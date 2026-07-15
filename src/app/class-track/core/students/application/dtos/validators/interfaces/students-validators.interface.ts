import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { SearchStudentsProps } from "@/app/class-track/core/students/application/dtos/interfaces/search-students.interface";

export interface StudentsValidators {
    searchStudentsValidator: EntityValidator<SearchStudentsProps>;
}
