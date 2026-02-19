import { Router } from "express";


export class AppRouter {

    public static get routes(): Router {
        const router = Router();

        return router;
    }
}