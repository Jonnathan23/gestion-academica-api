import type { Request, Response, NextFunction } from "express";

import { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";
import { CreateModuleDto, UpdateModuleDto } from "@/app/admin-desk/modules/domain/dtos";
import { CustomError } from "@/core/error";
import { CreateModule, DeleteModule, GetAllModules, GetModuleById, UpdateModule } from "@/app/admin-desk/modules/application";
import { SuccessResponse } from "@/core/utils";
import { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";

export class ModuleController {
    public constructor(private readonly moduleRepository: ModuleRepository) {}

    public createModule = (req: Request, res: Response, next: NextFunction) => {
        const [error, createModuleDto] = CreateModuleDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        const createModule = new CreateModule(this.moduleRepository);

        createModule
            .execute(createModuleDto!)
            .then(() => {
                const successMessage = "Module created successfully";

                SuccessResponse.created(res, successMessage);
            })
            .catch((error) => {
                next(error);
            });
    };

    public getAllModules = (req: Request, res: Response, next: NextFunction) => {
        const getAllModules = new GetAllModules(this.moduleRepository);

        getAllModules
            .execute()
            .then((modules) => {
                const successMessage = "Modules found successfully";

                SuccessResponse.ok<ModuleEntity[]>(res, successMessage, modules);
            })
            .catch((error) => {
                next(error);
            });
    };

    public getModuleById = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) throw CustomError.badRequest("Module is required");

        const getModule = new GetModuleById(this.moduleRepository);

        getModule
            .execute(id.toString())
            .then((module) => {
                const successMessage = "Modules found successfully";

                SuccessResponse.ok<ModuleEntity>(res, successMessage, module);
            })
            .catch((error) => {
                next(error);
            });
    };

    public updateModule = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const [error, updateModuleDto] = UpdateModuleDto.create(req.body);

        if (!id) throw CustomError.badRequest("Module is required");
        if (error) throw CustomError.badRequest(error);

        const updateModule = new UpdateModule(this.moduleRepository);

        updateModule
            .execute(id.toString(), updateModuleDto!)
            .then(() => {
                const successMessage = "Module updated successfully";

                SuccessResponse.ok(res, successMessage);
            })
            .catch((error) => {
                next(error);
            });
    };

    public deleteModule = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) throw CustomError.badRequest("Module is required");

        const deleteModule = new DeleteModule(this.moduleRepository);

        deleteModule
            .execute(id.toString())
            .then(() => {
                const successMessage = "Module deleted successfully";

                SuccessResponse.ok(res, successMessage);
            })
            .catch((error) => {
                next(error);
            });
    };
}
