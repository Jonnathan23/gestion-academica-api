import { Router } from "express";

import { ModulesRouter } from "@/app/AdminDesk/modules/presentation/router";
import { StudentsRouter } from "@/app/AdminDesk/students/presentation/router";
import { UserRouter } from "@/app/Shared/Identity/presentation/router";


export class AppRouter {

    public static get routes(): Router {
        const router = Router();

        router.use('/user', UserRouter.routes);

        router.use('/modules', ModulesRouter.routes);

        router.use('/students', StudentsRouter.routes);

        return router;
    }
}