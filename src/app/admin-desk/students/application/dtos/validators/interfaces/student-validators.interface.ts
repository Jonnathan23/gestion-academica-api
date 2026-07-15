import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { ChangeContractStatusProps } from "@/app/admin-desk/students/application/dtos/interfaces/change-contract-status.interface";
import type { RegisterStudentProps } from "@/app/admin-desk/students/application/dtos/interfaces/register-student.interface";
import type { SearchStudentsByCriteriaProps } from "@/app/admin-desk/students/application/dtos/interfaces/search-students-by-criteria.interface";
import type { UpdateStudentProps } from "@/app/admin-desk/students/application/dtos/interfaces/update-student.interface";

export interface StudentValidators {
    changeContractStatusValidator: EntityValidator<ChangeContractStatusProps>;
    registerStudentValidator: EntityValidator<RegisterStudentProps>;
    searchStudentsByCriteriaValidator: EntityValidator<SearchStudentsByCriteriaProps>;
    updateStudentValidator: EntityValidator<UpdateStudentProps>;
}
