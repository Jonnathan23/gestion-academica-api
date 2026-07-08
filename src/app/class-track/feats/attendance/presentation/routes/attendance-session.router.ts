import { Router } from "express";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendance-session.repository.impl";

import { AttendanceSessionController } from "@/app/class-track/feats/attendance/presentation/controllers/attendance-session.controller";
import { StudentClassTrackDataSourceImpl } from "@/app/class-track/core/students/infrastructure/datasources/student.datasource.impl";
import { StudentClassTrackRepositoryImpl } from "@/app/class-track/core/students/infrastructure/repositories/student.repository.impl";
import { environmentVariables } from "@/core/config/envs";
import { RoleMiddleware } from "@/core/middleware/role.mid";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { systemPermissions } from "@/core/constants/permissions";
import { attendanceValidators } from "@/app/class-track/feats/attendance/application/dtos/validators/di-validators";

export class AttendanceSessionRouter {
    public static get routes(): Router {
        const router = Router();

        const attendanceDatasource = new AttendanceSessionDatasourceImpl();
        const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

        const studentClassTrackDataSource = new StudentClassTrackDataSourceImpl();
        const studentClassTrackRepository = new StudentClassTrackRepositoryImpl(studentClassTrackDataSource);

        const useSecureCookies = environmentVariables.secureCookies;
        const controller = new AttendanceSessionController(
            attendanceRepository,
            studentClassTrackRepository,
            useSecureCookies,
            attendanceValidators,
        );

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
