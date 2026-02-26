import { Router } from "express";

import { UserDataSourceImpl } from "@/app/Shared/Identity/infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@/app/Shared/Identity/infrastructure/repositories/user.repository.impl";
import { UserController } from "@/app/Shared/Identity/presentation/controllers/User.Controller";
import { AuthMiddleware } from "@/core/middleware";


export class UserRouter {

    public static get routes(): Router {
        const router = Router();

        const userDatasource = new UserDataSourceImpl();
        const userRespository = new UserRepositoryImpl(userDatasource);
        const userController = new UserController(userRespository);



        // Posts
        router.post("/",
            AuthMiddleware.validateJWT,
            userController.registerUser
        );
        
        router.post("/login", userController.login);

        // Gets
        router.get("/",
            AuthMiddleware.validateJWT,
            userController.findAll);

        router.get('/:id',
            AuthMiddleware.validateJWT,
            userController.findById
        );

        // Patchs
        router.patch("/:id",
            AuthMiddleware.validateJWT,
            userController.update
        );

        router.patch('/:id/state',
            AuthMiddleware.validateJWT,
            userController.changeStateActive
        );

        router.patch('/:id/password',
            AuthMiddleware.validateJWT,
            userController.changePassword
        );

        return router;
    }

}