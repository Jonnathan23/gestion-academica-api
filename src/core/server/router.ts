import { Router } from "express";


export class AppRouter {

    public static get routes(): Router {
        const router = Router();

        router.get('/', (req, res) => {
            res.send('Hello World!');
        });

        return router;
    }
}