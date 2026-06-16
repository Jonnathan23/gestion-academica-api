import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "@/core/middleware/auth.mid";
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
import { JwtAdapter } from "@/core/utils/adapters/jwt";
import { clientRoles, userRoles } from "@/core/interfaces/Roles.interfaces";

export class AttendanceSessionController {
    private readonly cookieStudentSessionName = "classTrackSession";
    private readonly cookieStudentSessionMaxAge = 8 * 60 * 60 * 1000;

    constructor(
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
        private readonly studentProjectionRepository: StudentClassTrackRepository,
        private readonly useSecureCookies: boolean,
    ) {}

    //* Metodos publicos

    public checkIn = (req: Request, res: Response, next: NextFunction) => {
        const [error, startDto] = StartAttendanceSessionDto.create(req.body);

        if (error || !startDto) {
            return next(CustomError.badRequest(error || "Invalid request data"));
        }

        const isSystemUser =
            (req as AuthRequest).userSession?.role === userRoles.TEACHER ||
            (req as AuthRequest).userSession?.role === userRoles.ACADEMIC_DIRECTOR;

        if (isSystemUser) {
            return this.handleTeacherCheckIn(startDto, res, next);
        }

        this.handleStudentCheckIn(startDto, res, next);
    };

    public checkOut = (req: Request, res: Response, next: NextFunction) => {
        const [error, endDto] = EndAttendanceSessionDto.create(req.body);

        if (error || !endDto) {
            return next(CustomError.badRequest(error || "Invalid request data"));
        }

        const isSystemUser = !!(req as AuthRequest).userSession;

        if (isSystemUser) {
            return this.handleTeacherCheckOut(endDto, res, next);
        }

        this.handleStudentCheckOut(endDto, req as AuthRequest, res, next);
    };

    public approve = (req: Request, res: Response, next: NextFunction) => {
        const teacherId = (req as AuthRequest).userSession?.id;
        const [error, approveDto] = ApproveAttendanceSessionDto.create(req.body, teacherId!.toString());

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

    //* Métodos privados

    private handleStudentCheckIn = (startDto: StartAttendanceSessionDto, response: Response, next: NextFunction) => {
        new StartAttendanceSessionUseCase(this.attendanceSessionRepository, this.studentProjectionRepository)
            .execute(startDto)
            .then(async (attendanceSession) => {
                const studentToken = await JwtAdapter.generateStudentToken({
                    id: attendanceSession.atSeStudentId,
                    sessionId: attendanceSession.atSeId,
                    role: clientRoles.STUDENT,
                });

                return { attendanceSession, studentToken };
            })
            .then(({ attendanceSession, studentToken }) => {
                if (!studentToken) {
                    throw CustomError.internalServer("Error generating student token");
                }

                // Manejo de la cookie
                response.cookie(this.cookieStudentSessionName, studentToken, {
                    httpOnly: true,
                    secure: this.useSecureCookies,
                    sameSite: "lax",
                    maxAge: this.cookieStudentSessionMaxAge,
                });

                SuccessResponse.created(response, "Student check-in successful", attendanceSession);
            })
            .catch((processError) => next(processError));
    };

    private handleTeacherCheckIn = (startDto: StartAttendanceSessionDto, response: Response, next: NextFunction) => {
        new StartAttendanceSessionUseCase(this.attendanceSessionRepository, this.studentProjectionRepository)
            .execute(startDto)
            .then((attendanceSession) => SuccessResponse.created(response, "Check-in successful", attendanceSession))
            .catch((processError) => next(processError));
    };

    private handleStudentCheckOut = (endDto: EndAttendanceSessionDto, req: AuthRequest, response: Response, next: NextFunction) => {
        if (endDto.sessionId !== req.studentSession?.sessionId) {
            return next(CustomError.forbidden("You do not have permission to check out this session"));
        }

        new EndAttendanceSessionUseCase(this.attendanceSessionRepository)
            .execute(endDto)
            .then((session) => {
                response.clearCookie(this.cookieStudentSessionName);
                SuccessResponse.ok(response, "Student check-out successful", session);
            })
            .catch((processError) => next(processError));
    };

    private handleTeacherCheckOut = (endDto: EndAttendanceSessionDto, response: Response, next: NextFunction) => {
        new EndAttendanceSessionUseCase(this.attendanceSessionRepository)
            .execute(endDto)
            .then((session) => SuccessResponse.ok(response, "Check-out successful", session))
            .catch((processError) => next(processError));
    };
}
