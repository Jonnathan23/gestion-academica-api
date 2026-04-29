import { Router } from "express";

import { StudentLevelDataSourceImpl } from "@/app/AdminDesk/contracts/infrastructure/datasource/StudentLevel.datasource.impl";
import { StudentLevelRepositoryImpl } from "@/app/AdminDesk/contracts/infrastructure/repositories/contract.repository.impl";
import { ContractController } from "@/app/AdminDesk/contracts/presentation/controllers/Contract.Controller";
import { AuthMiddleware, RoleMiddleware, VerifyUUID } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";

export class ContractsRouter {

    static get routes(): Router {
        const router = Router();

        const studentLevelDataSource = new StudentLevelDataSourceImpl();
        const StudentLevelRepository = new StudentLevelRepositoryImpl(studentLevelDataSource);
        const contractController = new ContractController(StudentLevelRepository);

        // Required middleware for all routes in this module
        router.use(AuthMiddleware.validateJWT);

        // Router-level params validation
        router.param('studentId', VerifyUUID.validate);
        router.param('contractId', VerifyUUID.validate);
        router.param('studentLevelId', VerifyUUID.validate);

        // POST /api/contracts/student/:studentId
        router.post("/student/:studentId",
            RoleMiddleware.requirePermissions([
                systemPermissions.ADMINDESK_CONTRACTS_READ,
                systemPermissions.ADMINDESK_CONTRACTS_WRITE
            ]),
            contractController.purchaseModules
        );

        // GET /api/contracts/student/:studentId
        router.get("/student/:studentId",
            RoleMiddleware.requirePermissions([
                systemPermissions.ADMINDESK_CONTRACTS_READ
            ]),
            contractController.getStudentContracts
        );

        // PATCH /api/contracts/:contractId/status
        router.patch("/:contractId/status",
            RoleMiddleware.requirePermissions([
                systemPermissions.ADMINDESK_CONTRACTS_READ,
                systemPermissions.ADMINDESK_CONTRACTS_WRITE
            ]),
            contractController.updateStudentLevel
        );

        // DELETE /api/contracts/:studentLevelId
        router.delete("/:studentLevelId",
            RoleMiddleware.requirePermissions([
                systemPermissions.ADMINDESK_CONTRACTS_READ,
                systemPermissions.ADMINDESK_CONTRACTS_WRITE
            ]),
            contractController.deleteStudentLevel
        );

        return router;
    }
}
