import type { Request, Response, NextFunction } from "express";

import { SuccessResponse } from "@/core/utils";
import { GetDashboardSummaryUseCase } from "@/app/class-track/feats/dashboard/application/use-cases/getDashboardSummary.use-case";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";
import type { StudentProjectionRepository } from "@/app/class-track/feats/attendance/domain/repositories/studentProjection.repository";
import type { DashboardSummaryProjection } from "@/app/class-track/feats/dashboard/domain/projections/Dashboard.projection";

export class DashboardController {
    constructor(
        private readonly attendanceRepository: AttendanceSessionRepository,
        private readonly studentRepository: StudentProjectionRepository,
    ) {}

    public getSummary = (req: Request, res: Response, next: NextFunction): void => {
        const getDashboardSummary = new GetDashboardSummaryUseCase(this.attendanceRepository, this.studentRepository);

        getDashboardSummary
            .execute()
            .then((summary) => {
                const successMessage = "Dashboard summary retrieved successfully";
                SuccessResponse.ok<DashboardSummaryProjection>(res, successMessage, summary);
            })
            .catch((error) => {
                next(error);
            });
    };
}
