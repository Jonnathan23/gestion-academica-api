import { Router } from "express";

import { StudentLevelDataSourceImpl } from "@/app/admin-desk/student-level/infrastructure/datasource/studentLevel.datasource.impl";
import { StudentLevelRepositoryImpl } from "@/app/admin-desk/student-level/infrastructure/repositories/student-level.repository.impl";
import { ContractController } from "@/app/admin-desk/student-level/presentation/controllers/contract.controller";
import { InfoStudentsLevelRouter } from "@/app/admin-desk/student-level/presentation/info-students-level.router";
import { LevelProgressionDomainServiceImpl } from "@/app/admin-desk/student-level/domain/services/levelProgression.domain.service";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { RoleMiddleware } from "@/core/middleware/role.mid";
import { VerifyUUID } from "@/core/middleware/verifyUuId.mid";
import { systemPermissions } from "@/core/constants/permissions";

export class ContractsRouter {
    public static get routes(): Router {
        const router = Router();

        const levelProgressionDomainService = new LevelProgressionDomainServiceImpl();

        const studentLevelDataSource = new StudentLevelDataSourceImpl();
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
