import { UserRouter } from "@/app/Shared/Identity/presentation/router";
import { CustomError } from "@/core/error";
import { Router } from "express";


export class AppRouter {

    public static get routes(): Router {
        const router = Router();

        router.use('/user', UserRouter.routes);

        return router;
    }
}