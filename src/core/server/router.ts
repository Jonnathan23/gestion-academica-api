import { CustomError } from "@/core/error";
import { Router } from "express";


export class AppRouter {

    public static get routes(): Router {
        const router = Router();

        router.get('/', (req, res) => {
            
            throw CustomError.badRequest('Bad request');
        });

        return router;
    }
}