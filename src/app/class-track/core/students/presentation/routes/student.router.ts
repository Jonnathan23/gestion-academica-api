import { StudentClassTrackDataSourceImpl } from "@/app/class-track/core/students/infrastructure/datasources/student.datasource.impl";
import { StudentClassTrackRepositoryImpl } from "@/app/class-track/core/students/infrastructure/repositories/student.repository.impl";
import { StudentClassTrackController } from "@/app/class-track/core/students/presentation/controllers/student.controller";
import { systemPermissions } from "@/core/constants/permissions";
import { RoleMiddleware } from "@/core/middleware";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { Router } from "express";

export class StudentRouterClassTrack {
    public static get routes(): Router {
        const router = Router();

        const dataSource = new StudentClassTrackDataSourceImpl();
        const repository = new StudentClassTrackRepositoryImpl(dataSource);
        const controller = new StudentClassTrackController(repository);

        router.get(
            "/search",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_STUDENTS_READ]),
            controller.searchStudents,
        );

        return router;
    }
}
