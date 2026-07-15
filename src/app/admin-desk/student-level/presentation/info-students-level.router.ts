import { Router } from "express";

import { InfoStudentsLevelDataSourceImpl } from "@/app/admin-desk/student-level/infrastructure/datasource/infoStudentsLevel.datasource.impl";
import { InfoStudentsLevelRepositoryImpl } from "@/app/admin-desk/student-level/infrastructure/repositories/info-students-level.repository.impl";
import { InfoStudentsLevelController } from "@/app/admin-desk/student-level/presentation/controllers/info-students-level.controller";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { RoleMiddleware } from "@/core/middleware/role.mid";
import { VerifyUUID } from "@/core/middleware/verifyUuId.mid";
import { systemPermissions } from "@/core/constants/permissions";
import { studentLevelValidators } from "@/app/admin-desk/student-level/application/dtos/validators/di-validators";

export class InfoStudentsLevelRouter {
    public static get routes(): Router {
        const router = Router();

        const dataSource = new InfoStudentsLevelDataSourceImpl();
        const repository = new InfoStudentsLevelRepositoryImpl(dataSource);
        const controller = new InfoStudentsLevelController(repository, studentLevelValidators);

        // Required middleware for all routes in this module
        router.use(AuthMiddleware.validateJWT);

        // Param validation
        router.param("studentId", VerifyUUID.validate);

        // GET /api/student-levels/search
        router.get("/search", RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_CONTRACTS_READ]), controller.searchStudents);

        // GET /api/student-levels/student/:studentId/timeline
        router.get(
            "/student/:studentId/timeline",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_CONTRACTS_READ]),
            controller.getStudentTimeline,
        );

        return router;
    }
}
