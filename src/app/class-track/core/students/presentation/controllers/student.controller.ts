import type { Request, Response, NextFunction } from "express";

import { SuccessResponse } from "@/core/utils/success-response";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";
import { SearchStudentsDto } from "@/app/class-track/core/students/application/dtos/search-student-dto.dto";
import { SearchStudentsUseCase } from "@/app/class-track/core/students/application/use-cases/search-students.use-case";
import type { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";
import type { StudentsValidators } from "@/app/class-track/core/students/application/dtos/validators/interfaces/students-validators.interface";

export class StudentClassTrackController {
    public constructor(
        private readonly studentRepository: StudentClassTrackRepository,
        private readonly validators: StudentsValidators,
    ) {}

    public searchStudents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchStudentsDto = SearchStudentsDto.create(
                req.query as Record<string, unknown>,
                this.validators.searchStudentsValidator,
            );

            const useCaseInstance = new SearchStudentsUseCase(this.studentRepository);

            const result = await useCaseInstance.execute(searchStudentsDto);
            const successMessage = "Students retrieved successfully";

            return SuccessResponse.ok<StudentClassTrackProjection[]>(res, successMessage, result);
        } catch (error) {
            next(error);
        }
    };
}
