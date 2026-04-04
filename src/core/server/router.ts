import { Router } from "express";

import { ModulesRouter } from "@/app/AdminDesk/modules/presentation/router";
import { StudentsRouter } from "@/app/AdminDesk/students/presentation/router";
import { ContractsRouter } from "@/app/AdminDesk/contracts/presentation/router";
import { UserRouter } from "@/app/Shared/Identity/presentation/router";
import { PaymentRouter } from "@/app/AdminDesk/payments/presentation/router";
import { UserDataSourceImpl } from "@/app/Shared/Identity/infrastructure/datasources/user.datasource.impl";
import { AuthMiddleware } from "@/core/middleware";


export class AppRouter {

    public static get routes(): Router {
        const router = Router();

        const userDataSource = new UserDataSourceImpl();

        const verify = (userId: string) => userDataSource.checkUserActiveStatus(userId);

        AuthMiddleware.configure(verify);

        router.use('/user', UserRouter.routes);

        router.use('/modules', ModulesRouter.routes);

        router.use('/students', StudentsRouter.routes);

        router.use('/student-levels', ContractsRouter.routes);

        router.use('/payments', PaymentRouter.routes);

        return router;
    }
}