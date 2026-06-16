import { Router } from "express";
import { AuthMiddleware } from "@/core/middleware";
import { VerifyController } from "@/app/shared/verify/presentation/verify.controller";

export class VerifyRouter {
    public static get routes(): Router {
        const router = Router();
        const controller = new VerifyController();

        router.get("/user", AuthMiddleware.validateJWT, controller.verifyUser);
        router.get("/student", AuthMiddleware.validateStudentJWT, controller.verifyStudent);

        return router;
    }
}
