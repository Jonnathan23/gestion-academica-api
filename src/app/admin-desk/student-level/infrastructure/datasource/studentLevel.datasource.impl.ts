import type { StudentLevelDataSource } from "@/app/admin-desk/student-level/domain/datasource/studentLevel.datasource";
import type { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import { StudentLevelMapper } from "@/app/admin-desk/student-level/infrastructure/mappers/contract.mapper";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { ModuleEntity } from "@/app/admin-desk/modules/domain/entities/module.entity";
import { ModuleMapper } from "@/app/admin-desk/modules/infrastructure/mappers/module.mapper";

import { StudentModule, Module, Student } from "@/data/models/admin-desk";
import { User } from "@/data/models/shared";
import { CustomError } from "@/core/error";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import { studentModuleStatus } from "@/core/interfaces/Contracts.interface";

export class StudentLevelDataSourceImpl implements StudentLevelDataSource {
    constructor() {}

    //* Public methods
    async getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]> {
        const studentContracts = await this.fetchAllStudentContractsWithSellers(studentId);
        return await this.convertArrayToDetailsEntity(studentContracts);
    }

    async getModulesByIds(moduleIds: string[]): Promise<ModuleEntity[]> {
        const modulesFromDb = await this.searchModules(moduleIds);
        return modulesFromDb.map((module) => ModuleMapper.moduleModelToEntity(module));
    }

    async saveProgressionTransaction(
        newContracts: StudentLevelEntity[],
        contractsToUpdate: StudentLevelEntity[],
    ): Promise<StudentLevelEntity[]> {
        const sequelize = StudentModule.sequelize;
        if (!sequelize) {
            throw CustomError.serviceUnavailable("Sequelize instance not found");
        }

        return await sequelize.transaction(async (transaction) => {
            let created: StudentModule[] = [];

            if (newContracts.length > 0) {
                const recordsToInsert = newContracts.map((entity) => ({
                    st_mod_student_id: entity.studentId,
                    st_mod_module_id: entity.moduleId,
                    st_mod_seller_id: entity.sellerId,
                    st_mod_status: entity.status,
                    st_mod_freeze_count: entity.freezeCount,
                    st_mod_reactivation_count: entity.reactivateCount,
                    st_mod_purchase_date: entity.purchaseDate,
                }));

                created = await StudentModule.bulkCreate(recordsToInsert, { transaction });

                created.forEach((record, index) => {
                    const originalEntity = newContracts[index];
                    if (originalEntity) {
                        Object.defineProperty(originalEntity, "id", { value: record.st_mod_id, writable: false });
                    }
                });
            }

            const updatePromises = contractsToUpdate.map((entity) => {
                if (!entity.id) return Promise.resolve();
                return StudentModule.update({ st_mod_status: entity.status }, { where: { st_mod_id: entity.id }, transaction });
            });

            await Promise.all(updatePromises);

            const allIdsToFetch: string[] = [];

            created.forEach((record) => allIdsToFetch.push(record.st_mod_id));
            contractsToUpdate.forEach((entity) => {
                if (entity.id) allIdsToFetch.push(entity.id);
            });

            const finalRecords = await StudentModule.findAll({
                where: { st_mod_id: allIdsToFetch },
                include: [{ model: Module, as: "module" }],
                order: [[{ model: Module, as: "module" }, "mo_level", "ASC"]],
                transaction,
            });

            return this.convertArrayToEntity(finalRecords);
        });
    }

    async unlockLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        const { studentLevelId, studentId } = dto;

        const studentsLevels = await this.fetchAllStudentContractsWithSellers(studentId);

        const targetLevel = studentsLevels.find((studentModule) => studentModule.st_mod_id === studentLevelId);

        if (!targetLevel) throw CustomError.notFound("Target level not found");

        const previousLevelsAproved = studentsLevels.filter((studentModule) => studentModule.module.mo_level < targetLevel.module.mo_level);

        const isAllPreviousLevelsApproved = previousLevelsAproved.every(
            (studentModule) => studentModule.st_mod_status === studentModuleStatus.Approved,
        );

        if (!isAllPreviousLevelsApproved) throw CustomError.badRequest("Previous levels are not approved");

        targetLevel.st_mod_status = studentModuleStatus.Active;

        await targetLevel.save();

        return this.convertToEntity(targetLevel);
    }

    async blockLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        const { studentLevelId } = dto;
        const targetLevel = await this.fetchContractById(studentLevelId);

        targetLevel.st_mod_status = studentModuleStatus.Locked;

        await targetLevel.save();

        return this.convertToEntity(targetLevel);
    }

    async getStudentIdByContract(contractId: string): Promise<string> {
        const targetContract = await this.fetchContractById(contractId);
        return targetContract.st_mod_student_id;
    }

    async deleteProgressionTransaction(contractId: string, contractsToUpdate: StudentLevelEntity[]): Promise<boolean> {
        const targetContract = await this.fetchContractById(contractId);

        const sequelize = StudentModule.sequelize;
        if (!sequelize) {
            throw CustomError.serviceUnavailable("Sequelize instance not found");
        }

        return await sequelize.transaction(async (transaction) => {
            await targetContract.destroy({ transaction });

            const updatePromises = contractsToUpdate.map((entity) => {
                return StudentModule.update({ st_mod_status: entity.status }, { where: { st_mod_id: entity.id }, transaction });
            });

            await Promise.all(updatePromises);

            return true;
        });
    }

    //* Private methods

    // Consults to database
    private async searchModules(moduleIds: string[]): Promise<Module[]> {
        const modulesFromDb = await Module.findAll({
            where: { mo_id: moduleIds },
            order: [["mo_level", "ASC"]],
        });

        if (modulesFromDb.length !== moduleIds.length) {
            throw CustomError.badRequest("One or more provided modules do not exist in the database");
        }

        return modulesFromDb;
    }

    private async fetchAllStudentContractsWithSellers(studentId: string): Promise<StudentModule[]> {
        return await StudentModule.findAll({
            where: { st_mod_student_id: studentId },
            include: [
                { model: Module, as: "module" },
                { model: User, as: "seller" },
                { model: Student, as: "student" },
            ],
            order: [[{ model: Module, as: "module" }, "mo_level", "ASC"]],
        });
    }

    private async fetchContractById(contractId: string): Promise<StudentModule> {
        const targetContract = await StudentModule.findByPk(contractId);

        if (!targetContract) {
            throw CustomError.notFound("Contract not found");
        }

        return targetContract;
    }

    private async fetchStudentContractsOrderedByName(studentId: string): Promise<StudentModule[]> {
        return await StudentModule.findAll({
            where: { st_mod_student_id: studentId },
            include: [{ model: Module, as: "module" }],
            order: [[{ model: Module, as: "module" }, "mo_name", "ASC"]],
        });
    }

    // Use Mappers
    private async convertToEntity(contract: StudentModule): Promise<StudentLevelEntity> {
        return StudentLevelMapper.studentLevelEntityFromObject(contract.toJSON());
    }

    private async convertArrayToEntity(contracts: StudentModule[]): Promise<StudentLevelEntity[]> {
        return contracts.map((contract) => StudentLevelMapper.studentLevelEntityFromObject(contract.toJSON()));
    }

    private async convertArrayToDetailsEntity(contracts: StudentModule[]): Promise<StudentLevelDetailsProjection[]> {
        return contracts.map((contract) => StudentLevelMapper.studentLevelDetailsEntityFromObject(contract.toJSON()));
    }

    public buildContractEntities(currentContracts: StudentLevelDetailsProjection[]): StudentLevelEntity[] {
        return StudentLevelMapper.buildContractEntities(currentContracts);
    }

    public buildNewContractsEntities(studentId: string, sellerId: string, modulesToPurchase: ModuleEntity[]): StudentLevelEntity[] {
        return StudentLevelMapper.buildNewContractsEntities(studentId, sellerId, modulesToPurchase);
    }
}
