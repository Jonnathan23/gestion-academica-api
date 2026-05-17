import { Router } from "express";

import { ModulesRouter } from "@/app/admin-desk/modules/presentation/router";
import { StudentsRouter } from "@/app/admin-desk/students/presentation/router";
import { ContractsRouter } from "@/app/admin-desk/student-level/presentation/router";
import { UserRouter } from "@/app/shared/Identity/presentation/router";
import { PaymentRouter } from "@/app/admin-desk/payments/presentation/router";
import { AuthMiddleware } from "@/core/middleware";
import { UserSegurityDataSourceImpl } from "@/app/shared/Identity/infrastructure/datasources/userSegurity.datasource.impl";


export class AppRouter {

    public static get routes(): Router {
        const router = Router();

        const userSegurityDataSource = new UserSegurityDataSourceImpl();

        const verify = (userId: string) => userSegurityDataSource.checkUserActiveStatus(userId);

        AuthMiddleware.configure(verify);

        router.use('/user', UserRouter.routes);

        router.use('/modules', ModulesRouter.routes);

        router.use('/students', StudentsRouter.routes);

        router.use('/student-levels', ContractsRouter.routes);

        router.use('/payments', PaymentRouter.routes);

        return router;
    }
}