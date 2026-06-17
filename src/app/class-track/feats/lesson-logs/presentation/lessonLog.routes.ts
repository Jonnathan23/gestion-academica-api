import { Router } from "express";

import { LessonLogDataSourceImpl } from "@/app/class-track/feats/lesson-logs/infrastructure/datasources/lessonLog.datasource.impl";
import { LessonLogRepositoryImpl } from "@/app/class-track/feats/lesson-logs/infrastructure/repositories/lessonLog.repository.impl";
import { LessonLogController } from "@/app/class-track/feats/lesson-logs/presentation/controllers/lessonLog.controller";
import { StudentClassTrackRepositoryImpl } from "@/app/class-track/core/students/infrastructure/repositories/student.repository.impl";
import { StudentClassTrackDataSourceImpl } from "@/app/class-track/core/students/infrastructure/datasources/student.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendanceSession.repository.impl";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";

export class LessonLogRoutes {
    static get routes(): Router {
        const router = Router();

        const studentRepository = new StudentClassTrackRepositoryImpl(new StudentClassTrackDataSourceImpl());
        const attendanceSessionRepository = new AttendanceSessionRepositoryImpl(new AttendanceSessionDatasourceImpl());

        const datasource = new LessonLogDataSourceImpl();
        const repository = new LessonLogRepositoryImpl(datasource);
        const controller = new LessonLogController(repository, studentRepository, attendanceSessionRepository);

        //TODO: Proteger las rutas con middlewares

        router.post("/", controller.createLessonLogs);
        router.get("/student/:studentId/last", controller.getLastLessonLog);

        return router;
    }
}
