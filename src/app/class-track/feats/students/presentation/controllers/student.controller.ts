import type { Request, Response, NextFunction } from "express";
import { SearchStudentsDto } from "@/app/class-track/feats/students/domain/dtos/SearchStudentDto.dto";
import type { StudentRepository } from "@/app/class-track/feats/students/domain/repositories/student.repository";
import { CustomError } from "@/core/error/customError.error";
import { SearchStudentsUseCase } from "@/app/class-track/feats/students/application/use-cases/searchStudents.use-case";
import type { StudentClassTrackProjection } from "@/app/class-track/feats/students/domain/projections/StudentClassTrack.projection";
import { SuccessResponse } from "@/core/utils/SuccesResponse";

export class StudentController {
    constructor(private readonly studentRepository: StudentRepository) {}

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
