import { Router } from "express";

import { UserDataSourceImpl } from "@/app/shared/identity/infrastructure/datasources/user.datasource.impl";
import { UserRepositoryImpl } from "@/app/shared/identity/infrastructure/repositories/user.repository.impl";
import { UserController } from "@/app/shared/identity/presentation/controllers/User.Controller";
import { AuthMiddleware, RoleMiddleware, VerifyUUID } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";
import { environmentVariables } from "@/core/config";

export class UserRouter {
    public static get routes(): Router {
        const router = Router();

        const userDatasource = new UserDataSourceImpl();

        const userRespository = new UserRepositoryImpl(userDatasource);

        const useSecureCookies = environmentVariables.secureCookies;
        const userController = new UserController(userRespository, useSecureCookies);

        router.param("id", VerifyUUID.validate);

        // 🔓 RUTAS PÚBLICAS
        router.post("/login", userController.login);

        // 🔐 RUTAS PRIVADAS (Solo Usuarios Logueados)
        /**
         * TODO: Agregar validaciones para cambiar contraseña
         * * Preguntar al usuario:
         * ? ¿Como desea cambiar la contraseña?
         * ? ¿Debe tener doble verificación (uso de algun Token?
         */
        router.patch("/:id/password", AuthMiddleware.validateJWT, userController.changePassword);

        // 🛑 RUTAS SÚPER PRIVADAS (Solo Administradores)
        //* Posts
        router.post(
            "/",
            [
                AuthMiddleware.validateJWT,
                RoleMiddleware.requirePermissions([systemPermissions.SHARED_IDENTITY_WRITE, systemPermissions.SHARED_IDENTITY_READ]),
            ],
            userController.registerUser,
        );

        router.post(
            "/:id/state",
            [
                AuthMiddleware.validateJWT,
                RoleMiddleware.requirePermissions([systemPermissions.SHARED_IDENTITY_WRITE, systemPermissions.SHARED_IDENTITY_READ]),
            ],
            userController.changeStateActive,
        );

        //* Gets
        router.get(
            "/",
            [AuthMiddleware.validateJWT, RoleMiddleware.requirePermissions([systemPermissions.SHARED_IDENTITY_READ])],
            userController.findAll,
        );

        router.get(
            "/:id",
            [AuthMiddleware.validateJWT, RoleMiddleware.requirePermissions([systemPermissions.SHARED_IDENTITY_READ])],
            userController.findById,
        );

        //* Patches
        router.patch(
            "/:id",
            [
                AuthMiddleware.validateJWT,
                RoleMiddleware.requirePermissions([systemPermissions.SHARED_IDENTITY_WRITE, systemPermissions.SHARED_IDENTITY_READ]),
            ],
            userController.update,
        );

        return router;
    }
}
