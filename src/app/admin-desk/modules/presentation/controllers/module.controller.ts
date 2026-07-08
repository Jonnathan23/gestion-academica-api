import type { Request, Response, NextFunction } from "express";

import { ModuleRepository } from "@/app/admin-desk/modules/domain/repositories/module.repository";
import { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import { CreateModuleDto } from "@/app/admin-desk/modules/application/dtos/create-module.dto";
import { UpdateModuleDto } from "@/app/admin-desk/modules/application/dtos/update-module.dto";
import { CustomError } from "@/core/error/customError.error";
import { CreateModule } from "@/app/admin-desk/modules/application/use-cases/create-module.use-case";
import { DeleteModule } from "@/app/admin-desk/modules/application/use-cases/delete-module.use-case";
import { GetAllModules } from "@/app/admin-desk/modules/application/use-cases/get-all-modules.use-case";
import { GetModuleById } from "@/app/admin-desk/modules/application/use-cases/get-module-by-id.use-case";
import { UpdateModule } from "@/app/admin-desk/modules/application/use-cases/update-module.use-case";
import { SuccessResponse } from "@/core/utils/success-response";
import type { ModuleValidators } from "@/app/admin-desk/modules/application/dtos/interfaces/module-validators.interface";

export class ModuleController {
    public constructor(
        private readonly moduleRepository: ModuleRepository,
        private readonly validators: ModuleValidators,
    ) {}

    public createModule = (req: Request, res: Response, next: NextFunction) => {
        try {
            const createModuleDto = CreateModuleDto.create(req.body, this.validators.createModuleValidator);
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
        } catch (error) {
            next(error);
        }
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
        try {
            const { id } = req.params;

            if (!id) {
                throw CustomError.badRequest("Module is required");
            }

            const updateModuleDto = UpdateModuleDto.create(req.body, this.validators.updateModuleValidator);
            const updateModule = new UpdateModule(this.moduleRepository);

            updateModule
                .execute(id.toString(), updateModuleDto)
                .then(() => {
                    const successMessage = "Module updated successfully";

                    SuccessResponse.ok(res, successMessage);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
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
