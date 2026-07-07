import { Router } from "express";

import { RoleMiddleware, AuthMiddleware } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";
import { RetentionAlertDatasourceImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/datasource/retentionAlert.datasource.impl";
import { RetentionAlertRepositoryImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/repositories/retention-alert.repository.impl";
import { RetentionAlertController } from "@/app/class-track/feats/retention-alerts/presentation/controllers/retention-alert.controller";

export class RetentionAlertRoutes {
    public static get routes(): Router {
        const router = Router();

        const datasource = new RetentionAlertDatasourceImpl();
        const repository = new RetentionAlertRepositoryImpl(datasource);
        const controller = new RetentionAlertController(repository);

        router.get(
            "/",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_RETENTION_ALERTS_READ]),
            controller.getAlerts,
        );

        router.patch(
            "/:id",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_RETENTION_ALERTS_WRITE]),
            controller.updateAlertInfo,
        );

        router.patch(
            "/:id/status",
            AuthMiddleware.validateJWT,
            RoleMiddleware.requirePermissions([systemPermissions.CLASSTRACK_RETENTION_ALERTS_WRITE]),
            controller.changeStatus,
        );

        return router;
    }
}
