import type { Request, Response, NextFunction } from "express";

import { CustomError } from "@/core/error/customError.error";

import { SuccessResponse } from "@/core/utils/SuccesResponse";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";
import { SearchStudentsDto } from "@/app/class-track/core/students/domain/dtos/SearchStudentDto.dto";
import { SearchStudentsUseCase } from "@/app/class-track/core/students/application/use-cases/searchStudents.use-case";
import type { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";

export class StudentClassTrackController {
    constructor(private readonly studentRepository: StudentClassTrackRepository) {}

    public searchStudents = (req: Request, res: Response, next: NextFunction) => {
        const [error, searchStudentsDto] = SearchStudentsDto.create(req.query);

        if (error) throw CustomError.badRequest(error);

        const useCaseInstance = new SearchStudentsUseCase(this.studentRepository);

        useCaseInstance
            .execute(searchStudentsDto!)
            .then((result) => {
                const successMessage = "Students retrieved successfully";
                SuccessResponse.ok<StudentClassTrackProjection[]>(res, successMessage, result);
            })
            .catch((error) => {
                next(error);
            });
    };
}
