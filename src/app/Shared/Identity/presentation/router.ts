import { UserDataSourceImpl } from "@/app/Shared/Identity/infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@/app/Shared/Identity/infrastructure/repositories/user.repository.impl";
import { UserController } from "@/app/Shared/Identity/presentation/controllers/User.Controller";
import { Router } from "express";


export class UserRouter {

    public static get routes(): Router {
        const router = Router();

        const userDatasource = new UserDataSourceImpl();
        const userRespository = new UserRepositoryImpl(userDatasource);
        const userController = new UserController(userRespository);

        // Posts
        router.post("/", userController.registerUser);

        // Gets
        router.get("/", userController.findAll);
        router.get('/:id', userController.findById);

        // Patchs
        router.patch("/:id", userController.update);
        router.patch('/:id/state', userController.changeStateActive);
        router.patch('/:id/password', userController.changePassword);

        return router;
    }

}