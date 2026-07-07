import { CustomError } from "@/core/error";
import { SuccessResponse } from "@/core/utils";
import type { Request, Response, NextFunction } from "express";

import type { InfoStudentsLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/infoStudentsLevel.repository";
import { SearchStudentsLevelsDto } from "@/app/admin-desk/student-level/domain/dtos/search-students-levels.dto";
import { GetStudentTimelineDto } from "@/app/admin-desk/student-level/domain/dtos/get-student-timeline.dto";
import { SearchStudentsUseCase } from "@/app/admin-desk/student-level/application/use-cases/search-students.use-case";
import { GetStudentTimelineUseCase } from "@/app/admin-desk/student-level/application/use-cases/get-student-timeline.use-case";
import type { StudentSearchProjection } from "@/app/admin-desk/student-level/domain/projections/StudentSearch.projection";
import type { StudentTimelineProjection } from "@/app/admin-desk/student-level/domain/projections/StudentTimeline.projection";

export class InfoStudentsLevelController {
    public constructor(private readonly repository: InfoStudentsLevelRepository) {}

    public searchStudents = (req: Request, res: Response, next: NextFunction) => {
        const [error, dto] = SearchStudentsLevelsDto.create(req.query);

        if (error) {
            throw CustomError.badRequest(error);
        }

        const useCase = new SearchStudentsUseCase(this.repository);

        useCase
            .execute(dto!)
            .then((result) => {
                SuccessResponse.ok<StudentSearchProjection[]>(res, "Students retrieved successfully", result);
            })
            .catch((error) => {
                next(error);
            });
    };

    public getStudentTimeline = (req: Request, res: Response, next: NextFunction) => {
        const [error, dto] = GetStudentTimelineDto.create(req.params);

        if (error) {
            throw CustomError.badRequest(error);
        }

        const useCase = new GetStudentTimelineUseCase(this.repository);

        useCase
            .execute(dto!)
            .then((result) => {
                SuccessResponse.ok<StudentTimelineProjection>(res, "Student timeline retrieved successfully", result);
            })
            .catch((error) => {
                next(error);
            });
    };
}
