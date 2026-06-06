import { Router } from "express";
import { LessonLogDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/LessonLog.datasource.impl";
import { LessonLogRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/LessonLog.repository.impl";
import { LessonLogController } from "@/app/class-track/feats/attendance/presentation/controllers/LessonLog.controller";

export class LessonLogRouter {
    public static get routes(): Router {
        const router = Router();

        const datasource = new LessonLogDatasourceImpl();
        const repository = new LessonLogRepositoryImpl(datasource);
        const controller = new LessonLogController(repository);

        router.post("/lesson-logs", controller.registerLessonLog);

        return router;
    }
}
