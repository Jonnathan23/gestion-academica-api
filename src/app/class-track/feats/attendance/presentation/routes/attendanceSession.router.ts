import { Router } from "express";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendanceSession.repository.impl";
import { StudentProjectionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/studentProjection.datasource.impl";
import { StudentProjectionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/studentProjection.repository.impl";
import { AttendanceSessionController } from "@/app/class-track/feats/attendance/presentation/controllers/attendanceSession.controller";
import { RoleMiddleware } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";

export class AttendanceSessionRouter {
    public static get routes(): Router {
        const router = Router();

        const attendanceDatasource = new AttendanceSessionDatasourceImpl();
        const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

        const studentProjectionDatasource = new StudentProjectionDatasourceImpl();
        const studentProjectionRepository = new StudentProjectionRepositoryImpl(studentProjectionDatasource);

        const controller = new AttendanceSessionController(attendanceRepository, studentProjectionRepository);

        router.post("/check-in", RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_SESSIONS_READ]), controller.checkIn);
        router.patch("/check-out", RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_SESSIONS_READ]), controller.checkOut);

        return router;
    }
}
