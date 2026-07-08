import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { searchStudentsSchema } from "@/app/class-track/core/students/application/dtos/validators/schemas/valibot/search-students.schema";
import { StudentsValidatorsImpl } from "@/app/class-track/core/students/application/dtos/validators/validator";

import type { SearchStudentsProps } from "@/app/class-track/core/students/application/dtos/interfaces/search-students.interface";

const searchStudentsValidator = createValidator<SearchStudentsProps>(searchStudentsSchema);

export const studentsValidators = new StudentsValidatorsImpl(searchStudentsValidator);
