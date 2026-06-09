import { StudentDataSourceImpl } from "@/app/class-track/feats/students/infrastructure/datasources/student.datasource.impl";
import { StudentRepositoryImpl } from "@/app/class-track/feats/students/infrastructure/repositories/student.repository.impl";
import { StudentController } from "@/app/class-track/feats/students/presentation/controllers/student.controller";
import { systemPermissions } from "@/core/constants/Permissions";
import { RoleMiddleware } from "@/core/middleware";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { Router } from "express";

export class StudentRouterClassTrack {
    public static get routes(): Router {
        const router = Router();

        const dataSource = new StudentDataSourceImpl();
        const repository = new StudentRepositoryImpl(dataSource);
        const controller = new StudentController(repository);

        router.get(
            "/search",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_STUDENTS_READ]),
            controller.searchStudents,
        );

        return router;
    }
}
