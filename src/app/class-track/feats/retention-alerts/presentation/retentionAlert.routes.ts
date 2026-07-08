import { Router } from "express";
import { RetentionAlertDatasourceImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/datasource/retentionAlert.datasource.impl";
import { RetentionAlertRepositoryImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/repositories/retention-alert.repository.impl";
import { RetentionAlertController } from "@/app/class-track/feats/retention-alerts/presentation/controllers/retention-alert.controller";
import { RoleMiddleware } from "@/core/middleware/role.mid";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { systemPermissions } from "@/core/constants/permissions";
import { retentionAlertsValidators } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/di-validators";

export class RetentionAlertRoutes {
    public static get routes(): Router {
        const router = Router();

        const datasource = new RetentionAlertDatasourceImpl();
        const repository = new RetentionAlertRepositoryImpl(datasource);
        const controller = new RetentionAlertController(repository, retentionAlertsValidators);

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
