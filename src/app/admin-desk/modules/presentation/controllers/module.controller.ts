import type { Request, Response, NextFunction } from "express";

import { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";
import { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import { CreateModuleDto } from "@/app/admin-desk/modules/domain/dtos/create-module.dto";
import { UpdateModuleDto } from "@/app/admin-desk/modules/domain/dtos/update-module.dto";
import { CustomError } from "@/core/error/customError.error";
import { CreateModule } from "@/app/admin-desk/modules/application/use-cases/create-module.use-case";
import { DeleteModule } from "@/app/admin-desk/modules/application/use-cases/delete-module.use-case";
import { GetAllModules } from "@/app/admin-desk/modules/application/use-cases/get-all-modules.use-case";
import { GetModuleById } from "@/app/admin-desk/modules/application/use-cases/get-module-by-id.use-case";
import { UpdateModule } from "@/app/admin-desk/modules/application/use-cases/update-module.use-case";
import { SuccessResponse } from "@/core/utils/success-response";

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
