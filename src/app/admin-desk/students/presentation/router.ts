import { Router } from "express";

import { StudentDataSourceImpl } from "@/app/admin-desk/students/infrastructure/datasource/student.datasource.impl";
import { StudentRepositoryImpl } from "@/app/admin-desk/students/infrastructure/repositories/student.repository.impl";
import { StudentController } from "@/app/admin-desk/students/presentation/controllers/Student.Controller";
import { AuthMiddleware, RoleMiddleware, VerifyUUID } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";

export class StudentsRouter {
    static get routes(): Router {
        const router = Router();

        const studentDatasource = new StudentDataSourceImpl();
        const studentRepository = new StudentRepositoryImpl(studentDatasource);
        const studentController = new StudentController(studentRepository);

        // Protect all routes
        router.param("id", VerifyUUID.validate);
        router.use(AuthMiddleware.validateJWT);

        // POST /register
        router.post(
            "/register",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_STUDENTS_READ, systemPermissions.ADMINDESK_STUDENTS_WRITE]),
            studentController.register,
        );

        // GET /search?q=nombre_o_ci
        router.get("/search", RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_STUDENTS_READ]), studentController.search);

        // GET /
        router.get("/", RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_STUDENTS_READ]), studentController.getAllStudents);

        // PATCH /:id
        router.patch(
            "/:id",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_STUDENTS_READ, systemPermissions.ADMINDESK_STUDENTS_WRITE]),
            studentController.update,
        );

        // PATCH /:id/contract-status
        router.patch(
            "/:id/contract-status",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_STUDENTS_READ, systemPermissions.ADMINDESK_STUDENTS_WRITE]),
            studentController.changeContractStatus,
        );

        // POST /:id/graduated
        router.patch(
            "/:id/graduated",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_STUDENTS_READ, systemPermissions.ADMINDESK_STUDENTS_WRITE]),
            studentController.toggleGraduated,
        );

        // PATCH /:id/deactivate
        router.patch(
            "/:id/deactivate",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_STUDENTS_READ, systemPermissions.ADMINDESK_STUDENTS_WRITE]),
            studentController.deactivate,
        );

        return router;
    }
}
