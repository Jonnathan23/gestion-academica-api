import { UserDataSourceImpl } from "@/app/Shared/Identity/infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@/app/Shared/Identity/infrastructure/repositories/user.repository.impl";
import { UserController } from "@/app/Shared/Identity/presentation/User.Controller";
import { Router } from "express";


export class UserRouter {

    public static get routes(): Router {
        const router = Router();

        const userDatasource = new UserDataSourceImpl();
        const userRespository = new UserRepositoryImpl(userDatasource);
        const userController = new UserController(userRespository);

        router.post("/", userController.registerUser);

        return router;
    }

}