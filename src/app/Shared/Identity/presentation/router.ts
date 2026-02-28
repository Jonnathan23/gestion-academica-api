import { Router } from "express";

import { UserDataSourceImpl } from "@/app/Shared/Identity/infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@/app/Shared/Identity/infrastructure/repositories/user.repository.impl";
import { UserController } from "@/app/Shared/Identity/presentation/controllers/User.Controller";
import { AuthMiddleware, RoleMiddleware, VerifyUUID } from "@/core/middleware";



export class UserRouter {

    public static get routes(): Router {
        const router = Router();

        const userDatasource = new UserDataSourceImpl();
        const userRespository = new UserRepositoryImpl(userDatasource);
        const userController = new UserController(userRespository);

        router.param('id', VerifyUUID.validate);

        // 🔓 RUTAS PÚBLICAS
        router.post("/login", userController.login);

        // 🔐 RUTAS PRIVADAS (Solo Usuarios Logueados)
        router.get("/:id", AuthMiddleware.validateJWT, userController.findById);
        router.patch("/:id/password", AuthMiddleware.validateJWT, userController.changePassword);

        // 🛑 RUTAS SÚPER PRIVADAS (Solo Administradores)
        //* Posts
        /**
         * TODO: Agregar validaciones para registrar usuarios
         * * Preguntar al administrador:
         * ? ¿Como desea permitir el registro de usuarios?
         * ? ¿Debe tener doble verificación?
         */
        router.post("/", [AuthMiddleware.validateJWT, RoleMiddleware.isAdmin], userController.registerUser);

        //* Gets
        router.get("/", [AuthMiddleware.validateJWT, RoleMiddleware.isAdmin], userController.findAll);

        //* Patches
        router.patch("/:id", [AuthMiddleware.validateJWT, RoleMiddleware.isAdmin], userController.update);
        router.patch("/:id/state", [AuthMiddleware.validateJWT, RoleMiddleware.isAdmin], userController.changeStateActive);

        return router;
    }

}