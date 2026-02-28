import type { ModuleDataSource } from "@/app/AdminDesk/modules/domain/datasource/module.datasource";
import type { CreateModuleDto, UpdateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import { ModuleMapper } from "@/app/AdminDesk/modules/infrastructure/mappers/module.mapper";
import { CustomError } from "@/core/error";
import { Module } from "@/data/models/AdminDesk";

type moduleEntityFromObject = typeof ModuleMapper.moduleModelToEntity;

export class ModuleDataSourceImpl implements ModuleDataSource {

    constructor(
        private readonly moduleEntityFromObject: moduleEntityFromObject = ModuleMapper.moduleModelToEntity
    ) { }

    async getAllModules(): Promise<ModuleEntity[]> {
        try {
            const modules = await Module.findAll();
            return modules.map(module => this.moduleEntityFromObject(module));
        } catch (error) {
            throw error
        }
    }

    async getModuleById(moduleId: string): Promise<ModuleEntity> {
        try {
            const module = await Module.findByPk(moduleId);
            if (!module) {
                throw CustomError.notFound("Module not found");
            }

            return this.moduleEntityFromObject(module);
        } catch (error) {
            throw error;
        }
    }

    async createModule(module: CreateModuleDto): Promise<void> {
        const { mo_name, mo_description } = module
        try {
            const moduleExist = await Module.findOne({ where: { mo_name } });
            if (moduleExist) {
                throw CustomError.badRequest("Module already exists");
            }

            await Module.create({
                mo_name: mo_name,
                mo_description: mo_description
            });

        } catch (error) {
            throw error;
        }
    }

    async updateModule(id: string, module: UpdateModuleDto): Promise<void> {
        const { mo_name, mo_description } = module
        try {
            const moduleExist = await Module.findOne({ where: { mo_id: id } });
            if (!moduleExist) {
                throw CustomError.notFound("Module not found");
            }

            await moduleExist.update({
                mo_name: mo_name ?? moduleExist.mo_name,
                mo_description: mo_description ?? moduleExist.mo_description
            })

        } catch (error) {
            throw error;
        }
    }

    async deleteModule(id: string): Promise<void> {
        try {
            const moduleExist = await Module.findOne({ where: { mo_id: id } });
            if (!moduleExist) {
                throw CustomError.notFound("Module not found");
            }

            await moduleExist.destroy();
        } catch (error) {
            throw error;
        }
    }

}