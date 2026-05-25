import { Router } from "express";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/attendance/infrastructure/datasource/AttendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/attendance/infrastructure/repositories/AttendanceSession.repository.impl";
import { StudentProjectionDatasourceImpl } from "@/app/class-track/attendance/infrastructure/datasource/StudentProjection.datasource.impl";
import { StudentProjectionRepositoryImpl } from "@/app/class-track/attendance/infrastructure/repositories/StudentProjection.repository.impl";
import { AttendanceSessionController } from "@/app/class-track/attendance/presentation/attendanceSession.controller";

export class AttendanceSessionRouter {
    public static get routes(): Router {
        const router = Router();

        const attendanceDatasource = new AttendanceSessionDatasourceImpl();
        const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

        const studentProjectionDatasource = new StudentProjectionDatasourceImpl();
        const studentProjectionRepository = new StudentProjectionRepositoryImpl(studentProjectionDatasource);

        const controller = new AttendanceSessionController(attendanceRepository, studentProjectionRepository);

        router.post("/check-in", controller.checkIn);
        router.patch("/check-out", controller.checkOut);

        return router;
    }
}
