import { Router } from "express";

import { StudentLevelDataSourceImpl } from "@/app/AdminDesk/contracts/infrastructure/datasource/contract.datasource.impl";
import { StudentLevelRepositoryImpl } from "@/app/AdminDesk/contracts/infrastructure/repositories/contract.repository.impl";
import { ContractController } from "@/app/AdminDesk/contracts/presentation/controllers/Contract.Controller";
import { AuthMiddleware, RoleMiddleware, VerifyUUID } from "@/core/middleware";

export class ContractsRouter {

    static get routes(): Router {
        const router = Router();

        const studentLevelDataSource = new StudentLevelDataSourceImpl();
        const StudentLevelRepository = new StudentLevelRepositoryImpl(studentLevelDataSource);
        const contractController = new ContractController(StudentLevelRepository);

        // Required middleware for all routes in this module
        router.use(AuthMiddleware.validateJWT);
        router.use(RoleMiddleware.isAdmin); // or whatever appropriate role

        // Router-level params validation
        router.param('studentId', VerifyUUID.validate);
        router.param('contractId', VerifyUUID.validate);
        router.param('studentLevelId', VerifyUUID.validate);

        // POST /api/contracts/student/:studentId
        router.post("/student/:studentId", contractController.purchaseModules);

        // GET /api/contracts/student/:studentId
        router.get("/student/:studentId", contractController.getStudentContracts);

        // PATCH /api/contracts/:contractId/status
        router.patch("/:contractId/status", contractController.updateStudentLevel);

        // DELETE /api/contracts/:studentLevelId
        router.delete("/:studentLevelId", contractController.deleteStudentLevel);

        return router;
    }
}
