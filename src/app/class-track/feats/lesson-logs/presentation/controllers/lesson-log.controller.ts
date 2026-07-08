import type { Request, Response, NextFunction } from "express";

import { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/application/dtos/create-lessong-log.dto";
import { GetLastLessonLogDto } from "@/app/class-track/feats/lesson-logs/application/dtos/get-last-lesson-log.dto";
import { CreateLessonLogsUseCase } from "@/app/class-track/feats/lesson-logs/application/use-cases/create-lesson-logs.use-case";
import { GetLastLessonLogUseCase } from "@/app/class-track/feats/lesson-logs/application/use-cases/get-last-lesson-log.use-case";
import { SuccessResponse } from "@/core/utils/success-response";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendance-session.repository";
import type { LessonLogRepository } from "@/app/class-track/feats/lesson-logs/domain/repositories/lesson-log.repository";
import type { LessonLogsValidators } from "@/app/class-track/feats/lesson-logs/application/dtos/validators/interfaces/lesson-logs-validators.interface";

export class LessonLogController {
    public constructor(
        private readonly repository: LessonLogRepository,
        private readonly studentRepository: StudentClassTrackRepository,
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
        private readonly lessonLogsValidators: LessonLogsValidators,
    ) {}

    public createLessonLogs = (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = CreateLessonLogsDto.create(req.body, this.lessonLogsValidators.createLessonLogsValidator);

            const useCase = new CreateLessonLogsUseCase(this.repository, this.studentRepository, this.attendanceSessionRepository);

            useCase
                .execute(dto)
                .then((result) => {
                    SuccessResponse.created(res, "Lesson logs successfully created", result);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public getLastLessonLog = (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GetLastLessonLogDto.create(
                { studentId: req.params.studentId },
                this.lessonLogsValidators.getLastLessonLogValidator,
            );

            const useCase = new GetLastLessonLogUseCase(this.repository);

            useCase
                .execute(dto)
                .then((result) => {
                    SuccessResponse.ok(res, "Last lesson log successfully retrieved", result);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };
}
