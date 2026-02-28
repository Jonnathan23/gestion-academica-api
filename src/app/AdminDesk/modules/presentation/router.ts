import { Router } from "express";

import { ModuleDataSourceImpl } from "@/app/AdminDesk/modules/infrastructure/datasource/module.datasource.impl";
import { ModuleRepositoryImpl } from "@/app/AdminDesk/modules/infrastructure/repositories/module.repository.impl";
import { ModuleController } from "@/app/AdminDesk/modules/presentation/controllers/Module.controller";
import { AuthMiddleware, VerifyUUID } from "@/core/middleware";


export class ModulesRouter {

    static get routes(): Router {
        const router = Router();

        const moduleDatasource = new ModuleDataSourceImpl();
        const moduleRespository = new ModuleRepositoryImpl(moduleDatasource);
        const moduleController = new ModuleController(moduleRespository);

        router.use(AuthMiddleware.validateJWT)
        router.param('id', VerifyUUID.validate);

        //Posts
        router.post("/", moduleController.createModule);

        //Gets
        router.get("/", moduleController.getAllModules);
        router.get("/:id", moduleController.getModuleById);

        //PATCH
        router.patch("/:id", moduleController.updateModule);

        //DELETE
        router.delete("/:id", moduleController.deleteModule);


        return router
    }
}