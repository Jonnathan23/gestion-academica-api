import { Router } from "express";

import { PaymentDataSourceImpl } from "@/app/admin-desk/payments/infrastructure/datasources/payment.datasource.impl";
import { PaymentRepositoryImpl } from "@/app/admin-desk/payments/infrastructure/repositories/payment.repository";
import { PaymentController } from "@/app/admin-desk/payments/presentation/controllers/payment.controller";
import { systemPermissions } from "@/core/constants/permissions";
import { AuthMiddleware } from "@/core/middleware/auth.mid";
import { RoleMiddleware } from "@/core/middleware/role.mid";
import { VerifyUUID } from "@/core/middleware/verifyUuId.mid";
import { paymentValidators } from "@/app/admin-desk/payments/application/dtos/validators/di-validators";

export class PaymentRouter {
    public static get routes(): Router {
        const router = Router();

        // 1. Inyección de Dependencias
        const paymentDataSource = new PaymentDataSourceImpl();
        const paymentRepository = new PaymentRepositoryImpl(paymentDataSource);
        const paymentController = new PaymentController(paymentRepository, paymentValidators);

        // 2. Middlewares Globales del Router
        router.use(AuthMiddleware.validateJWT);

        // 3. Validación de Parámetros (UUID)
        router.param("studentId", VerifyUUID.validate);
        router.param("quotaId", VerifyUUID.validate);

        // POST /api/payments/student/:studentId/plan (Crear nuevo plan de pago)
        router.post(
            "/student/:studentId/plan",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_PAYMENTS_READ, systemPermissions.ADMINDESK_PAYMENTS_WRITE]),
            paymentController.createPaymentPlan,
        );

        // GET /api/payments/student/:studentId (Obtener el historial y estado financiero)
        router.get(
            "/student/:studentId",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_PAYMENTS_READ]),
            paymentController.getStudentPaymentPlans,
        );

        // PATCH /api/payments/quota/:quotaId/pay (Procesar el pago de una cuota)
        router.patch(
            "/quota/:quotaId/pay",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_PAYMENTS_READ, systemPermissions.ADMINDESK_PAYMENTS_WRITE]),
            paymentController.processQuotaPayment,
        );

        // POST /api/payments/quota/:quotaId/revert (Anular un pago por error humano)
        router.post(
            "/quota/:quotaId/revert",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_PAYMENTS_READ, systemPermissions.ADMINDESK_PAYMENTS_WRITE]),
            paymentController.revertQuotaPayment,
        );

        return router;
    }
}
