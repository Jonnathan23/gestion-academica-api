import type { Request, Response, NextFunction } from "express";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";
import type { StudentProjectionRepository } from "@/app/class-track/feats/attendance/domain/repositories/studentProjection.repository";
import { StartAttendanceSessionUseCase } from "@/app/class-track/feats/attendance/application/use-cases/startAttendanceSession.use-case";
import { EndAttendanceSessionUseCase } from "@/app/class-track/feats/attendance/application/use-cases/endAttendanceSession.use-case";
import { StartAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/StartAttendanceSession.dto";
import { EndAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/EndAttendanceSession.dto";
import { CustomError } from "@/core/error/customError.error";
import { SuccessResponse } from "@/core/utils/SuccesResponse";

export class AttendanceSessionController {
    constructor(
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
        private readonly studentProjectionRepository: StudentProjectionRepository,
    ) {}

    public checkIn = (req: Request, res: Response, next: NextFunction) => {
        const [error, startDto] = StartAttendanceSessionDto.create(req.body);

        if (error || !startDto) {
            return next(CustomError.badRequest(error || "Invalid request data"));
        }

        new StartAttendanceSessionUseCase(this.attendanceSessionRepository, this.studentProjectionRepository)
            .execute(startDto)
            .then((session) => SuccessResponse.created(res, "Check-in successful", session))
            .catch((error) => next(error));
    };

    public checkOut = (req: Request, res: Response, next: NextFunction) => {
        const [error, endDto] = EndAttendanceSessionDto.create(req.body);

        if (error || !endDto) {
            return next(CustomError.badRequest(error || "Invalid request data"));
        }

        new EndAttendanceSessionUseCase(this.attendanceSessionRepository)
            .execute(endDto)
            .then((session) => SuccessResponse.ok(res, "Check-out successful", session))
            .catch((error) => next(error));
    };
}
