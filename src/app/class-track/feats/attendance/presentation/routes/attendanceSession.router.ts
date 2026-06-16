import { Router } from "express";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendanceSession.repository.impl";

import { AttendanceSessionController } from "@/app/class-track/feats/attendance/presentation/controllers/attendanceSession.controller";
import { RoleMiddleware, AuthMiddleware } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";
import { StudentClassTrackDataSourceImpl } from "@/app/class-track/core/students/infrastructure/datasources/student.datasource.impl";
import { StudentClassTrackRepositoryImpl } from "@/app/class-track/core/students/infrastructure/repositories/student.repository.impl";
import { environmentVariables } from "@/core/config/envs";

export class AttendanceSessionRouter {
    public static get routes(): Router {
        const router = Router();

        const attendanceDatasource = new AttendanceSessionDatasourceImpl();
        const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

        const studentClassTrackDataSource = new StudentClassTrackDataSourceImpl();
        const studentClassTrackRepository = new StudentClassTrackRepositoryImpl(studentClassTrackDataSource);

        const useSecureCookies = environmentVariables.secureCookies;
        const controller = new AttendanceSessionController(attendanceRepository, studentClassTrackRepository, useSecureCookies);

        router.post("/check-in", AuthMiddleware.extractSharedPayload, controller.checkIn);

        router.patch(
            "/check-out",
            AuthMiddleware.validateSharedAccess,
            RoleMiddleware.requireSharedPermissions([systemPermissions.CLASSTRACK_SESSIONS_WRITE]),
            controller.checkOut,
        );

        router.patch(
            "/approve",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_ATTENDANCE_WRITE]),
            controller.approve,
        );

        router.get(
            "/in-progress",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_ATTENDANCE_READ]),
            controller.getActiveSessionsInProgress,
        );

        router.get(
            "/pending-approval",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_ATTENDANCE_READ]),
            controller.getActiveSessionsPendingApproval,
        );

        router.get(
            "/completed",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_ATTENDANCE_READ]),
            controller.getActiveSessionsCompleted,
        );

        return router;
    }
}
