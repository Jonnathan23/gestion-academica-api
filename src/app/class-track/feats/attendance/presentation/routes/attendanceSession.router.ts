import { Router } from "express";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendanceSession.repository.impl";
import { StudentProjectionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/studentProjection.datasource.impl";
import { StudentProjectionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/studentProjection.repository.impl";
import { AttendanceSessionController } from "@/app/class-track/feats/attendance/presentation/controllers/attendanceSession.controller";
import { RoleMiddleware, AuthMiddleware } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";

export class AttendanceSessionRouter {
    public static get routes(): Router {
        const router = Router();

        const attendanceDatasource = new AttendanceSessionDatasourceImpl();
        const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

        const studentProjectionDatasource = new StudentProjectionDatasourceImpl();
        const studentProjectionRepository = new StudentProjectionRepositoryImpl(studentProjectionDatasource);

        const controller = new AttendanceSessionController(attendanceRepository, studentProjectionRepository);

        router.post("/check-in", controller.checkIn);

        //TODO: validar con el middleware de autenticación para estudiantes y/o docentes
        router.patch("/check-out", controller.checkOut);

        router.get(
            "/in-progress",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_SESSIONS_READ]),
            controller.getActiveSessionsInProgress,
        );

        router.get(
            "/pending-approval",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_SESSIONS_READ]),
            controller.getActiveSessionsPendingApproval,
        );

        router.get(
            "/completed",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_SESSIONS_READ]),
            controller.getActiveSessionsCompleted,
        );

        return router;
    }
}
