import type { ModuleDataSource } from "@/app/admin-desk/modules/domain/datasource/module.datasource";
import type { CreateModuleDto, UpdateModuleDto } from "@/app/admin-desk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import { ModuleMapper } from "@/app/admin-desk/modules/infrastructure/mappers/module.mapper";
import { CustomError } from "@/core/error";
import { Module } from "@/data/models/AdminDesk";

type ModuleEntityFromObject = typeof ModuleMapper.moduleModelToEntity;

export class ModuleDataSourceImpl implements ModuleDataSource {
    constructor(private readonly moduleEntityFromObject: ModuleEntityFromObject = ModuleMapper.moduleModelToEntity) {}

    async getAllModules(): Promise<ModuleEntity[]> {
        const modules = await Module.findAll({ order: [["mo_level", "ASC"]] });
        return modules.map((module) => this.moduleEntityFromObject(module));
    }

    async getModuleById(moduleId: string): Promise<ModuleEntity> {
        const module = await Module.findByPk(moduleId);
        if (!module) {
            throw CustomError.notFound("Module not found");
        }

        return this.moduleEntityFromObject(module);
    }

    async createModule(module: CreateModuleDto): Promise<void> {
        const { mo_name, mo_description, mo_level } = module;

        const moduleExist = await Module.findOne({ where: { mo_name } });
        if (moduleExist) {
            throw CustomError.badRequest("Module already exists");
        }

        await Module.create({
            mo_name: mo_name,
            mo_description: mo_description,
            mo_level: mo_level,
        });
    }

    async updateModule(id: string, module: UpdateModuleDto): Promise<void> {
        const moduleExist = await Module.findOne({ where: { mo_id: id } });
        if (!moduleExist) {
            throw CustomError.notFound("Module not found");
        }

        await moduleExist.update(module.values);
    }

    async deleteModule(id: string): Promise<void> {
        const moduleExist = await Module.findOne({ where: { mo_id: id } });
        if (!moduleExist) {
            throw CustomError.notFound("Module not found");
        }

        await moduleExist.destroy();
    }
}
