import { Router } from "express";
import { AuthMiddleware, RoleMiddleware } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";
import { DashboardController } from "@/app/class-track/feats/dashboard/presentation/controllers/dashboard.controller";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendanceSession.repository.impl";
import { StudentProjectionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/studentProjection.datasource.impl";
import { StudentProjectionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/studentProjection.repository.impl";

export class DashboardRouter {
    public static get routes(): Router {
        const router = Router();

        const attendanceDatasource = new AttendanceSessionDatasourceImpl();
        const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

        const studentDatasource = new StudentProjectionDatasourceImpl();
        const studentRepository = new StudentProjectionRepositoryImpl(studentDatasource);

        const controller = new DashboardController(attendanceRepository, studentRepository);

        router.get(
            "/summary",
            [AuthMiddleware.validateJWT, RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_MAIN_ACCESS])],
            controller.getSummary,
        );

        return router;
    }
}
