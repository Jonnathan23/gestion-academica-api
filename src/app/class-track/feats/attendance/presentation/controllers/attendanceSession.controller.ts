import type { Request, Response, NextFunction } from "express";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";

import { StartAttendanceSessionUseCase } from "@/app/class-track/feats/attendance/application/use-cases/startAttendanceSession.use-case";
import { EndAttendanceSessionUseCase } from "@/app/class-track/feats/attendance/application/use-cases/endAttendanceSession.use-case";
import { ApproveAttendanceSessionUseCase } from "@/app/class-track/feats/attendance/application/use-cases/approveAttendanceSession.use-case";
import { StartAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/StartAttendanceSession.dto";
import { EndAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/EndAttendanceSession.dto";
import { ApproveAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/ApproveAttendanceSession.dto";
import { CustomError } from "@/core/error/customError.error";
import { SuccessResponse } from "@/core/utils/SuccesResponse";
import { GetActiveSessionsUseCase } from "@/app/class-track/feats/attendance/application/use-cases/getAllActiveSessions.use-case";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";

export class AttendanceSessionController {
    constructor(
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
        private readonly studentProjectionRepository: StudentClassTrackRepository,
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

    public approve = (req: Request, res: Response, next: NextFunction) => {
        const [error, approveDto] = ApproveAttendanceSessionDto.create(req.body);

        if (error || !approveDto) {
            return next(CustomError.badRequest(error || "Invalid request data"));
        }

        new ApproveAttendanceSessionUseCase(this.attendanceSessionRepository)
            .execute(approveDto)
            .then((session) => SuccessResponse.ok(res, "Check-out approved successfully", session))
            .catch((error) => next(error));
    };

    public getActiveSessionsInProgress = (req: Request, res: Response, next: NextFunction) => {
        new GetActiveSessionsUseCase(this.attendanceSessionRepository)
            .executeInProgress()
            .then((sessions) => SuccessResponse.ok(res, "Active sessions in progress retrieved successfully", sessions))
            .catch((error) => next(error));
    };

    public getActiveSessionsPendingApproval = (req: Request, res: Response, next: NextFunction) => {
        new GetActiveSessionsUseCase(this.attendanceSessionRepository)
            .executePendingApproval()
            .then((sessions) => SuccessResponse.ok(res, "Active sessions pending approval retrieved successfully", sessions))
            .catch((error) => next(error));
    };

    public getActiveSessionsCompleted = (req: Request, res: Response, next: NextFunction) => {
        new GetActiveSessionsUseCase(this.attendanceSessionRepository)
            .executeCompleted()
            .then((sessions) => SuccessResponse.ok(res, "Active sessions completed retrieved successfully", sessions))
            .catch((error) => next(error));
    };
}
