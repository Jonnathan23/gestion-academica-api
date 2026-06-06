import type { Request, Response, NextFunction } from "express";
import type { LessonLogRepository } from "@/app/class-track/feats/attendance/domain/repositories/LessonLog.repository";
import { RegisterLessonLogUseCase } from "@/app/class-track/feats/attendance/application/use-cases/registerLessonLog.use-case";
import { RegisterLessonLogDto } from "@/app/class-track/feats/attendance/domain/dtos/RegisterLessonLog.dto";
import { CustomError } from "@/core/error/customError.error";
import { SuccessResponse } from "@/core/utils/SuccesResponse";

export class LessonLogController {
    constructor(private readonly lessonLogRepository: LessonLogRepository) {}

    public registerLessonLog = (req: Request, res: Response, next: NextFunction) => {
        const [error, dto] = RegisterLessonLogDto.create(req.body);

        if (error || !dto) {
            return next(CustomError.badRequest(error || "Invalid request data"));
        }

        new RegisterLessonLogUseCase(this.lessonLogRepository)
            .execute(dto)
            .then((lessonLog) => SuccessResponse.created(res, "Lesson log registered successfully", lessonLog))
            .catch((error) => next(error));
    };
}
