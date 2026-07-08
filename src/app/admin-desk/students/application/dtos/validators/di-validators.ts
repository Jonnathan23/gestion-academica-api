import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { changeContractStatusSchema } from "@/app/admin-desk/students/application/dtos/validators/schemas/valibot/change-contract-status.schema";
import { registerStudentSchema } from "@/app/admin-desk/students/application/dtos/validators/schemas/valibot/register-student.schema";
import { searchStudentsByCriteriaSchema } from "@/app/admin-desk/students/application/dtos/validators/schemas/valibot/search-students-by-criteria.schema";
import { updateStudentSchema } from "@/app/admin-desk/students/application/dtos/validators/schemas/valibot/update-student.schema";
import { StudentValidatorsImpl } from "@/app/admin-desk/students/application/dtos/validators/validator";
import type { ChangeContractStatusProps } from "@/app/admin-desk/students/application/dtos/interfaces/change-contract-status.interface";
import type { RegisterStudentProps } from "@/app/admin-desk/students/application/dtos/interfaces/register-student.interface";
import type { SearchStudentsByCriteriaProps } from "@/app/admin-desk/students/application/dtos/interfaces/search-students-by-criteria.interface";
import type { UpdateStudentProps } from "@/app/admin-desk/students/application/dtos/interfaces/update-student.interface";

const changeContractStatusValidator = createValidator<ChangeContractStatusProps>(changeContractStatusSchema);
const registerStudentValidator = createValidator<RegisterStudentProps>(registerStudentSchema);
const searchStudentsByCriteriaValidator = createValidator<SearchStudentsByCriteriaProps>(searchStudentsByCriteriaSchema);
const updateStudentValidator = createValidator<UpdateStudentProps>(updateStudentSchema);

export const studentValidators = new StudentValidatorsImpl(
    changeContractStatusValidator,
    registerStudentValidator,
    searchStudentsByCriteriaValidator,
    updateStudentValidator,
);
