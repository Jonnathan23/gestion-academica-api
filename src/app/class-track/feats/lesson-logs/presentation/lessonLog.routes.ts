import { Router } from "express";

import { LessonLogRepositoryImpl } from "@/app/class-track/feats/lesson-logs/infrastructure/repositories/lesson-log.repository.impl";
import { LessonLogDataSourceImpl } from "@/app/class-track/feats/lesson-logs/infrastructure/datasources/lesson-log.datasource.impl";
import { LessonLogController } from "@/app/class-track/feats/lesson-logs/presentation/controllers/lesson-log.controller";

import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendance-session.repository.impl";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { StudentClassTrackRepositoryImpl } from "@/app/class-track/core/students/infrastructure/repositories/student.repository.impl";
import { StudentClassTrackDataSourceImpl } from "@/app/class-track/core/students/infrastructure/datasources/student.datasource.impl";

import { lessonLogsValidators } from "@/app/class-track/feats/lesson-logs/application/dtos/validators/di-validators";

export class LessonLogRoutes {
    public static get routes(): Router {
        const router = Router();

        const studentRepository = new StudentClassTrackRepositoryImpl(new StudentClassTrackDataSourceImpl());
        const attendanceSessionRepository = new AttendanceSessionRepositoryImpl(new AttendanceSessionDatasourceImpl());

        const datasource = new LessonLogDataSourceImpl();
        const repository = new LessonLogRepositoryImpl(datasource);
        const controller = new LessonLogController(repository, studentRepository, attendanceSessionRepository, lessonLogsValidators);

        //TODO: Proteger las rutas con middlewares

        router.post("/", controller.createLessonLogs);
        router.get("/student/:studentId/last", controller.getLastLessonLog);

        return router;
    }
}
