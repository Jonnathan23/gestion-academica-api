import { Router } from "express";
import { DashboardController } from "@/app/class-track/feats/dashboard/presentation/controllers/dashboard.controller";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendance-session.repository.impl";
import { StudentClassTrackDataSourceImpl } from "@/app/class-track/core/students/infrastructure/datasources/student.datasource.impl";
import { StudentClassTrackRepositoryImpl } from "@/app/class-track/core/students/infrastructure/repositories/student.repository.impl";
import { RetentionAlertDatasourceImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/datasource/retentionAlert.datasource.impl";
import { RetentionAlertRepositoryImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/repositories/retention-alert.repository.impl";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { RoleMiddleware } from "@/core/middleware/role.mid";
import { systemPermissions } from "@/core/constants/permissions";

export class DashboardRouter {
    public static get routes(): Router {
        const router = Router();

        const attendanceDatasource = new AttendanceSessionDatasourceImpl();
        const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

        const studentClassTrackDataSource = new StudentClassTrackDataSourceImpl();
        const studentClassTrackRepository = new StudentClassTrackRepositoryImpl(studentClassTrackDataSource);

        const retentionAlertDatasource = new RetentionAlertDatasourceImpl();
        const retentionAlertRepository = new RetentionAlertRepositoryImpl(retentionAlertDatasource);

        const controller = new DashboardController(attendanceRepository, retentionAlertRepository, studentClassTrackRepository);

        router.get(
            "/summary",
            [AuthMiddleware.validateJWT, RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_MAIN_ACCESS])],
            controller.getSummary,
        );

        return router;
    }
}
