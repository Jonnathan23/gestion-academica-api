import { ModulesRouter } from "@/app/AdminDesk/modules/presentation/router";
import { UserRouter } from "@/app/Shared/Identity/presentation/router";
import { Router } from "express";


export class AppRouter {

    public static get routes(): Router {
        const router = Router();

        router.use('/user', UserRouter.routes);

        router.use('/modules', ModulesRouter.routes);

        return router;
    }
}