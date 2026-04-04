import { Router } from "express";

import { ModulesRouter } from "@/app/AdminDesk/modules/presentation/router";
import { StudentsRouter } from "@/app/AdminDesk/students/presentation/router";
import { ContractsRouter } from "@/app/AdminDesk/contracts/presentation/router";
import { UserRouter } from "@/app/Shared/Identity/presentation/router";
import { PaymentRouter } from "@/app/AdminDesk/payments/presentation/router";
import { AuthMiddleware } from "@/core/middleware";
import { UserSegurityDataSourceImpl } from "@/app/Shared/Identity/infrastructure/datasources/userSegurity.datasource.impl";


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