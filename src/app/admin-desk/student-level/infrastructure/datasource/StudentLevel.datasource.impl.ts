import type { Transaction } from "sequelize";

import type {
    BulkCreateContractsProps,
    CalculateNewStudentModuleStatusProps,
    SelfHealingAlgorithmProps,
} from "@/app/admin-desk/student-level/infrastructure/interfaces/StudentLevelDatasource.interface";
import type { StudentLevelDataSource } from "@/app/admin-desk/student-level/domain/datasource/studentLevel.datasource";
import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import { StudentLevelMapper } from "@/app/admin-desk/student-level/infrastructure/mappers/contract.mapper";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";

import { StudentModule, Module, Student } from "@/data/models/admin-desk";
import { User } from "@/data/models/shared";
import { CustomError } from "@/core/error";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import { studentModuleStatus } from "@/core/interfaces/Contracts.interface";
import type { StudentModuleStatus } from "@/data/models/admin-desk/StudentModule.model";

export class StudentLevelDataSourceImpl implements StudentLevelDataSource {
    //* Public methods
    async getStudentContracts(studentId: string): Promise<StudentLevelDetailsProjection[]> {
        const studentContracts = await this.fetchAllStudentContractsWithSellers(studentId);
        return await this.convertArrayToDetailsEntity(studentContracts);
    }

    async purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        const { studentId, sellerId, moduleIds } = dto;
        //TODO: validar que no puede comprar un modulo si ya lo tiene
        //TODO: validar que no puede comprar un modulo posterior a uno que no ha adquirido, por ejemplo no puede adquirir el 3 si ha adquirido el 1 pero no el 2
        //TODO: validar que no puede adquirir modulos con salto de nivels, no puede 1 y 4, debe ser 1,2,3,4
        const sequelize = StudentModule.sequelize;

        if (!sequelize) throw CustomError.serviceUnavailable("Sequelize instance not found");

        const modulesFromDb = await this.searchModules(moduleIds);

        return await sequelize.transaction(async (transaction) => {
            const createdContracts = await this.bulkCreateContracts({ studentId, sellerId, modulesFromDb, transaction });

            const allStudentContracts = await this.getAllStudentContracts(studentId, transaction);

            const updatePromises: Promise<unknown>[] = await this.selfHealingAlgorithm({ allStudentContracts, transaction });

            await Promise.all(updatePromises);

            const finalPurchasedLevels = await this.getFinalPurchasedLevels(createdContracts);

            return this.convertArrayToEntity(finalPurchasedLevels);
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

    async finishCurrentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        const { studentLevelId, studentId } = dto;

        const studentsLevels = await this.fetchAllStudentContractsWithSellers(studentId);

        const targetLevel = studentsLevels.find((studentModule) => studentModule.st_mod_id === studentLevelId);

        if (!targetLevel) throw CustomError.notFound("Target level not found");

        const previousLevelsAproved = studentsLevels.filter((studentModule) => studentModule.module.mo_level < targetLevel.module.mo_level);

        const isAllPreviousLevelsApproved = previousLevelsAproved.every(
            (studentModule) => studentModule.st_mod_status === studentModuleStatus.Approved,
        );

        if (!isAllPreviousLevelsApproved) throw CustomError.badRequest("Previous levels are not approved");

        if (targetLevel.st_mod_status !== studentModuleStatus.Active) throw CustomError.badRequest("You can only finish active levels");

        targetLevel.st_mod_status = studentModuleStatus.Approved;

        await targetLevel.save();

        return this.convertToEntity(targetLevel);
    }

    async deleteStudentLevel(contractId: string): Promise<boolean> {
        const targetContract = await this.fetchContractById(contractId);
        const studentId = targetContract.st_mod_student_id;

        const allStudentContracts = await this.fetchStudentContractsOrderedByName(studentId);

        const remainingContracts = allStudentContracts.filter((contractItem) => contractItem.st_mod_id !== contractId);

        const sequelize = StudentModule.sequelize;
        if (!sequelize) {
            throw CustomError.serviceUnavailable("Sequelize instance not found");
        }

        return await sequelize.transaction(async (transaction) => {
            await targetContract.destroy({ transaction });

            const updatePromises = await this.selfHealingAlgorithm({ allStudentContracts: remainingContracts, transaction });

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

    private async getAllStudentContracts(studentId: string, transaction: Transaction): Promise<StudentModule[]> {
        return await StudentModule.findAll({
            where: { st_mod_student_id: studentId },
            include: [{ model: Module, as: "module" }],
            order: [[{ model: Module, as: "module" }, "mo_level", "ASC"]],
            transaction,
        });
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

    private async fetchOrderedStudentModules(studentId: string): Promise<StudentModule[]> {
        const studentModules = await StudentModule.findAll({
            where: { st_mod_student_id: studentId },
            include: [{ model: Module, as: "module" }],
            order: [[{ model: Module, as: "module" }, "mo_level", "ASC"]],
        });

        if (!studentModules.length) {
            throw CustomError.notFound("Student modules not found");
        }

        return studentModules.sort((firstModule, secondModule) => firstModule.module.mo_name.localeCompare(secondModule.module.mo_name));
    }

    private async findTargetContract(studentModules: StudentModule[], contractId: string): Promise<StudentModule> {
        const targetContract = studentModules.find((contractItem) => contractItem.st_mod_id === contractId);

        if (!targetContract) {
            throw CustomError.notFound("Contract not found");
        }

        return targetContract;
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

    private async getFinalPurchasedLevels(createdContracts: StudentModule[]) {
        const createdContractIds = createdContracts.map((contract) => contract.st_mod_id);

        return await StudentModule.findAll({
            where: { st_mod_id: createdContractIds },
            include: [{ model: Module, as: "module" }],
            order: [[{ model: Module, as: "module" }, "mo_level", "ASC"]],
        });
    }

    // Algorithms

    private calculateNewStudentModuleStatus(calcylateProps: CalculateNewStudentModuleStatusProps): StudentModuleStatus {
        const { statusRequested, currentIndex, targetModuleIndex, currentStatus } = calcylateProps;

        if (statusRequested === studentModuleStatus.Approved) {
            if (currentIndex <= targetModuleIndex) {
                return studentModuleStatus.Approved;
            } else if (currentIndex === targetModuleIndex + 1) {
                return studentModuleStatus.Active;
            }
            return studentModuleStatus.Locked;
        } else if (statusRequested === studentModuleStatus.Active) {
            if (currentIndex < targetModuleIndex) {
                return studentModuleStatus.Approved;
            } else if (currentIndex === targetModuleIndex) {
                return studentModuleStatus.Active;
            }
            return studentModuleStatus.Locked;
        } else {
            return currentIndex === targetModuleIndex ? statusRequested : currentStatus;
        }
    }

    private async bulkCreateContracts(props: BulkCreateContractsProps): Promise<StudentModule[]> {
        const { studentId, sellerId, modulesFromDb, transaction } = props;

        const recordsToInsert = modulesFromDb.map((currentModule) => ({
            st_mod_student_id: studentId,
            st_mod_module_id: currentModule.mo_id,
            st_mod_seller_id: sellerId,
            st_mod_status: studentModuleStatus.Locked,
            st_mod_freeze_count: 0,
            st_mod_reactivation_count: 0,
            st_mod_purchase_date: new Date(),
        }));

        return await StudentModule.bulkCreate(recordsToInsert, { transaction });
    }

    private async selfHealingAlgorithm(selfHealProps: SelfHealingAlgorithmProps): Promise<Promise<unknown>[]> {
        const { allStudentContracts, transaction } = selfHealProps;
        const updatePromises: Promise<unknown>[] = [];
        let isProgressionActive = false;

        for (let currentIndex = 0; currentIndex < allStudentContracts.length; currentIndex++) {
            const currentContract = allStudentContracts[currentIndex];
            if (!currentContract) continue;

            let newContractStatus: StudentModuleStatus = currentContract.st_mod_status as StudentModuleStatus;

            if (!isProgressionActive) {
                // El primero que NO esté aprobado, será el ACTIVE
                if (currentContract.st_mod_status !== studentModuleStatus.Approved) {
                    newContractStatus = studentModuleStatus.Active;
                    isProgressionActive = true;
                }
            } else {
                newContractStatus = studentModuleStatus.Locked;
            }

            // Actualizamos si el algoritmo detectó una anomalía temporal (ej: B2 estaba ACTIVE pero insertamos B1)
            if (currentContract.st_mod_status !== newContractStatus) {
                updatePromises.push(currentContract.update({ st_mod_status: newContractStatus }, { transaction }));
            }
        }

        return updatePromises;
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
}
