import type { Request, Response, NextFunction } from "express";

import type { InfoStudentsLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/info-students-level.repository";
import { SearchStudentsLevelsDto } from "@/app/admin-desk/student-level/application/dtos/search-students-levels.dto";
import { GetStudentTimelineDto } from "@/app/admin-desk/student-level/application/dtos/get-student-timeline.dto";
import { SearchStudentsUseCase } from "@/app/admin-desk/student-level/application/use-cases/search-students.use-case";
import { GetStudentTimelineUseCase } from "@/app/admin-desk/student-level/application/use-cases/get-student-timeline.use-case";
import type { StudentSearchProjection } from "@/app/admin-desk/student-level/domain/projections/StudentSearch.projection";
import type { StudentTimelineProjection } from "@/app/admin-desk/student-level/domain/projections/StudentTimeline.projection";

import { SuccessResponse } from "@/core/utils/success-response";
import type { StudentLevelValidators } from "@/app/admin-desk/student-level/application/dtos/validators/interfaces/student-level-validators.interface";

export class InfoStudentsLevelController {
    public constructor(
        private readonly repository: InfoStudentsLevelRepository,
        private readonly validators: StudentLevelValidators,
    ) {}

    public searchStudents = (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = SearchStudentsLevelsDto.create(req.query, this.validators.searchStudentsLevelsValidator);

            const useCase = new SearchStudentsUseCase(this.repository);

            useCase
                .execute(dto)
                .then((result) => {
                    SuccessResponse.ok<StudentSearchProjection[]>(res, "Students retrieved successfully", result);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public getStudentTimeline = (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetStudentTimelineDto.create(req.params, this.validators.getStudentTimelineValidator);

            const useCase = new GetStudentTimelineUseCase(this.repository);

            useCase
                .execute(dto)
                .then((result) => {
                    SuccessResponse.ok<StudentTimelineProjection>(res, "Student timeline retrieved successfully", result);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };
}
