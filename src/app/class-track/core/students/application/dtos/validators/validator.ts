import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { StudentsValidators } from "@/app/class-track/core/students/application/dtos/validators/interfaces/students-validators.interface";
import type { SearchStudentsProps } from "@/app/class-track/core/students/application/dtos/interfaces/search-students.interface";

export class StudentsValidatorsImpl implements StudentsValidators {
    public constructor(public readonly searchStudentsValidator: EntityValidator<SearchStudentsProps>) {}
}
