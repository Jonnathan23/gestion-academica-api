import { Router } from "express";

import { ModuleDataSourceImpl } from "@/app/admin-desk/modules/infrastructure/datasource/module.datasource.impl";
import { ModuleRepositoryImpl } from "@/app/admin-desk/modules/infrastructure/repositories/module.repository.impl";
import { ModuleController } from "@/app/admin-desk/modules/presentation/controllers/module.controller";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { RoleMiddleware } from "@/core/middleware/role.mid";
import { VerifyUUID } from "@/core/middleware/verifyUuId.mid";
import { systemPermissions } from "@/core/constants/permissions";

export class ModulesRouter {
    public static get routes(): Router {
        const router = Router();

        const moduleDatasource = new ModuleDataSourceImpl();
        const moduleRespository = new ModuleRepositoryImpl(moduleDatasource);
        const moduleController = new ModuleController(moduleRespository);

        router.use(AuthMiddleware.validateJWT);
        router.param("id", VerifyUUID.validate);

        //Posts
        router.post(
            "/",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_MODULES_READ, systemPermissions.ADMINDESK_MODULES_WRITE]),
            moduleController.createModule,
        );

        //Gets
        router.get("/", RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_MODULES_READ]), moduleController.getAllModules);

        router.get("/:id", RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_MODULES_READ]), moduleController.getModuleById);

        //PATCH
        router.patch(
            "/:id",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_MODULES_READ, systemPermissions.ADMINDESK_MODULES_WRITE]),
            moduleController.updateModule,
        );

        //DELETE
        router.delete(
            "/:id",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_MODULES_READ, systemPermissions.ADMINDESK_MODULES_WRITE]),
            moduleController.deleteModule,
        );

        return router;
    }
}
