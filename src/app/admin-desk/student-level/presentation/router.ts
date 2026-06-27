import { Router } from "express";

import { StudentLevelDataSourceImpl } from "@/app/admin-desk/student-level/infrastructure/datasource/studentLevel.datasource.impl";
import { StudentLevelRepositoryImpl } from "@/app/admin-desk/student-level/infrastructure/repositories/studentLevel.repository.impl";
import { ContractController } from "@/app/admin-desk/student-level/presentation/controllers/contract.controller";
import { AuthMiddleware, RoleMiddleware, VerifyUUID } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";
import { InfoStudentsLevelRouter } from "@/app/admin-desk/student-level/presentation/infoStudentsLevel.router";
import { LevelProgressionDomainServiceImpl } from "@/app/admin-desk/student-level/domain/services/levelProgression.domain.service";

export class ContractsRouter {
    public static get routes(): Router {
        const router = Router();

        const levelProgressionDomainService = new LevelProgressionDomainServiceImpl();

        const studentLevelDataSource = new StudentLevelDataSourceImpl(levelProgressionDomainService);
        const studentLevelRepository = new StudentLevelRepositoryImpl(studentLevelDataSource);
        const contractController = new ContractController(studentLevelRepository, levelProgressionDomainService);

        // Required middleware for all routes in this module
        router.use(AuthMiddleware.validateJWT);

        // Use the new info endpoints
        router.use(InfoStudentsLevelRouter.routes);

        // Router-level params validation
        router.param("studentId", VerifyUUID.validate);
        router.param("studentLevelId", VerifyUUID.validate);

        // POST /api/contracts/student/:studentId
        router.post(
            "/student/:studentId",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_CONTRACTS_READ, systemPermissions.ADMINDESK_CONTRACTS_WRITE]),
            contractController.purchaseModules,
        );

        // GET /api/contracts/student/:studentId
        router.get(
            "/student/:studentId",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_CONTRACTS_READ]),
            contractController.getStudentContracts,
        );

        // PATCH /api/contracts/:contractId/status/block
        router.patch(
            "/:studentLevelId/status/block/:studentId",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_CONTRACTS_READ, systemPermissions.ADMINDESK_CONTRACTS_WRITE]),
            contractController.blockLevel,
        );

        // PATCH /api/contracts/:contractId/status/unlock
        router.patch(
            "/:studentLevelId/status/unlock/:studentId",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_CONTRACTS_READ, systemPermissions.ADMINDESK_CONTRACTS_WRITE]),
            contractController.unlockLevel,
        );

        // PATCH /api/contracts/:contractId/status/finish-current
        router.patch(
            "/:studentLevelId/status/finish-current/:studentId",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_CONTRACTS_READ, systemPermissions.ADMINDESK_CONTRACTS_WRITE]),
            contractController.finishCurrentLevel,
        );

        // DELETE /api/contracts/:studentLevelId
        router.delete(
            "/:studentLevelId",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_CONTRACTS_READ, systemPermissions.ADMINDESK_CONTRACTS_WRITE]),
            contractController.deleteStudentLevel,
        );

        return router;
    }
}
