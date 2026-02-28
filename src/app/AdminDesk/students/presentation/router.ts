import { Router } from "express";

import { StudentDataSourceImpl } from "@/app/AdminDesk/students/infrastructure/datasource/student.datasource.impl";
import { StudentRepositoryImpl } from "@/app/AdminDesk/students/infrastructure/repositories/student.repository.impl";
import { StudentController } from "@/app/AdminDesk/students/presentation/controllers/Student.Controller";
import { AuthMiddleware, RoleMiddleware, VerifyUUID } from "@/core/middleware";

export class StudentsRouter {

    static get routes(): Router {
        const router = Router();

        const studentDatasource = new StudentDataSourceImpl();
        const studentRepository = new StudentRepositoryImpl(studentDatasource);
        const studentController = new StudentController(studentRepository);

        // Protect all routes
        router.use(AuthMiddleware.validateJWT);
        router.use(RoleMiddleware.isAdmin);

        // POST /register
        router.post("/register", studentController.register);

        // GET /search?q=nombre_o_ci
        router.get("/search", studentController.search);

        router.param('id', VerifyUUID.validate);

        // PATCH /:id
        router.patch("/:id", studentController.update);

        // PATCH /:id/contract-status
        router.patch("/:id/contract-status", studentController.changeContractStatus);

        // PATCH /:id/graduated
        router.patch("/:id/graduated", studentController.toggleGraduated);

        // PATCH /:id/deactivate
        router.patch("/:id/deactivate", studentController.deactivate);

        return router;
    }
}
