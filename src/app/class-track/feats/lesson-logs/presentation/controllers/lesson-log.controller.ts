import type { Request, Response, NextFunction } from "express";

import { CustomError } from "@/core/error/customError.error";
import { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/create-lessong-log.dto";
import { GetLastLessonLogDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/get-last-lesson-log.dto";
import { CreateLessonLogsUseCase } from "@/app/class-track/feats/lesson-logs/application/use-cases/create-lesson-logs.use-case";
import { GetLastLessonLogUseCase } from "@/app/class-track/feats/lesson-logs/application/use-cases/get-last-lesson-log.use-case";
import { SuccessResponse } from "@/core/utils/success-response";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";
import type { LessonLogRepository } from "@/app/class-track/feats/lesson-logs/domain/repositories/lessonLog.repository";

export class LessonLogController {
    public constructor(
        private readonly repository: LessonLogRepository,
        private readonly studentRepository: StudentClassTrackRepository,
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
    ) {}

    public createLessonLogs = (req: Request, res: Response, next: NextFunction) => {
        const [error, dto] = CreateLessonLogsDto.create(req.body);

        if (error || !dto) {
            throw CustomError.badRequest(error || "Invalid request body");
        }

        const useCase = new CreateLessonLogsUseCase(this.repository, this.studentRepository, this.attendanceSessionRepository);

        useCase
            .execute(dto)
            .then((result) => {
                SuccessResponse.created(res, "Lesson logs successfully created", result);
            })
            .catch((error) => {
                next(error);
            });
    };

    public getLastLessonLog = (req: Request, res: Response, next: NextFunction) => {
        const [error, dto] = GetLastLessonLogDto.create({ studentId: req.params.studentId });

        if (error || !dto) {
            throw CustomError.badRequest(error || "Invalid student ID");
        }

        const useCase = new GetLastLessonLogUseCase(this.repository);

        useCase
            .execute(dto)
            .then((result) => {
                SuccessResponse.ok(res, "Last lesson log successfully retrieved", result);
            })
            .catch((error) => {
                next(error);
            });
    };
}
