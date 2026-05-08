import { CustomError } from "@/core/error";
import type { StudentLevelDataSource } from "@/app/AdminDesk/contracts/domain/datasource/contract.datasource";
import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/AdminDesk/contracts/domain/dtos";
import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";
import { StudentLevelMapper } from "@/app/AdminDesk/contracts/infrastructure/mappers/contract.mapper";
import { StudentModule, Module } from "@/data/models/AdminDesk";
import { User } from "@/data/models/Shared";
import { studentModuleStatus, type StudentModuleStatus } from "@/app/AdminDesk/contracts/domain";
import type { Transaction } from "sequelize";


interface BulkCreateContractsProps {
    studentId: string;
    sellerId: string;
    modulesFromDb: Module[];
    transaction: Transaction;
}


export class StudentLevelDataSourceImpl implements StudentLevelDataSource {

    private async searchModules(moduleIds: string[]): Promise<Module[]> {
        const modulesFromDb = await Module.findAll({
            where: { mo_id: moduleIds },
            order: [['mo_level', 'ASC']]
        });

        if (modulesFromDb.length !== moduleIds.length) {
            throw CustomError.badRequest("One or more provided modules do not exist in the database");
        }

        return modulesFromDb;
    }

    private async getAllStudentContracts(studentId: string, transaction: Transaction): Promise<StudentModule[]> {
        return await StudentModule.findAll({
            where: { st_mod_student_id: studentId },
            include: [{ model: Module, as: 'module' }],
            order: [[{ model: Module, as: 'module' }, 'mo_level', 'ASC']],
            transaction
        });

    }

    private async bulkCreateContracts(props: BulkCreateContractsProps): Promise<StudentModule[]> {
        const { studentId, sellerId, modulesFromDb, transaction } = props;

        const recordsToInsert = modulesFromDb.map(currentModule => ({
            st_mod_student_id: studentId,
            st_mod_module_id: currentModule.mo_id,
            st_mod_seller_id: sellerId,
            st_mod_status: studentModuleStatus.LOCKED,
            st_mod_purchase_date: new Date()
        }));

        return await StudentModule.bulkCreate(recordsToInsert, { transaction });
    }

    private async selfHealingAlgorithm(allStudentContracts: StudentModule[], transaction: Transaction): Promise<Promise<any>[]> {
        const updatePromises: Promise<any>[] = [];
        let isProgressionActive = false;

        // 3. Algoritmo de Auto-Sanación Universal
        for (let currentIndex = 0; currentIndex < allStudentContracts.length; currentIndex++) {
            const currentContract = allStudentContracts[currentIndex];
            if (!currentContract) continue;

            let newContractStatus: StudentModuleStatus = currentContract.st_mod_status as StudentModuleStatus;

            if (!isProgressionActive) {
                // El primero que NO esté aprobado, será el ACTIVE
                if (currentContract.st_mod_status !== studentModuleStatus.APPROVED) {
                    newContractStatus = studentModuleStatus.ACTIVE;
                    isProgressionActive = true;
                }
            } else {
                newContractStatus = studentModuleStatus.LOCKED;
            }

            // Actualizamos si el algoritmo detectó una anomalía temporal (ej: B2 estaba ACTIVE pero insertamos B1)
            if (currentContract.st_mod_status !== newContractStatus) {
                updatePromises.push(
                    currentContract.update(
                        { st_mod_status: newContractStatus },
                        { transaction }
                    )
                );
            }
        }

        return updatePromises;
    }

    private async getFinalPurchasedLevels(createdContracts: StudentModule[]) {
        const createdContractIds = createdContracts.map(contract => contract.st_mod_id);

        return await StudentModule.findAll({
            where: { st_mod_id: createdContractIds },
            include: [{ model: Module, as: 'module' }],
            order: [[{ model: Module, as: 'module' }, 'mo_name', 'ASC']]
        });
    }


    private async convertToEntity(contracts: StudentModule[]): Promise<StudentLevelEntity[]> {
        return contracts.map(contract =>
            StudentLevelMapper.studentLevelEntityFromObject(contract.toJSON())
        );
    }



    async purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        const { studentId, sellerId, moduleIds } = dto;

        try {
            const sequelize = StudentModule.sequelize;
            if (!sequelize) throw CustomError.serviceUnavailable("Sequelize instance not found");

            const modulesFromDb = await this.searchModules(moduleIds);

            const transaction = await sequelize.transaction();
            try {

                const createdContracts = await this.bulkCreateContracts({ studentId, sellerId, modulesFromDb, transaction });

                const allStudentContracts = await this.getAllStudentContracts(studentId, transaction);

                const updatePromises: Promise<any>[] = await this.selfHealingAlgorithm(allStudentContracts, transaction);

                await Promise.all(updatePromises);

                await transaction.commit();

                const finalPurchasedLevels = await this.getFinalPurchasedLevels(createdContracts);

                return this.convertToEntity(finalPurchasedLevels);

            } catch (error) {
                await transaction.rollback();
                throw error;
            }

        } catch (error) {
            throw error;
        }
    }

    private async fetchAllStudentContractsWithSellers(studentId: string): Promise<StudentModule[]> {
        return await StudentModule.findAll({
            where: { st_mod_student_id: studentId },
            include: [
                { model: Module, as: "module" },
                { model: User, as: "seller" }
            ]
        });
    }

    private async fetchOrderedStudentModules(studentId: string): Promise<StudentModule[]> {
        const studentModules = await StudentModule.findAll({
            where: { st_mod_student_id: studentId },
            include: [{ model: Module, as: "module" }]
        });

        if (!studentModules.length) {
            throw CustomError.notFound("Student modules not found");
        }

        return studentModules.sort((firstModule, secondModule) =>
            firstModule.module.mo_name.localeCompare(secondModule.module.mo_name)
        );
    }

    private findTargetContract(studentModules: StudentModule[], contractId: string): StudentModule {
        const targetContract = studentModules.find(
            contractItem => contractItem.st_mod_id === contractId
        );

        if (!targetContract) {
            throw CustomError.notFound("Contract not found");
        }

        return targetContract;
    }

    private calculateNewStudentModuleStatus(
        statusRequested: StudentModuleStatus,
        currentIndex: number,
        targetModuleIndex: number,
        currentStatus: StudentModuleStatus
    ): StudentModuleStatus {
        if (statusRequested === studentModuleStatus.APPROVED) {
            if (currentIndex <= targetModuleIndex) {
                return studentModuleStatus.APPROVED;
            } else if (currentIndex === targetModuleIndex + 1) {
                return studentModuleStatus.ACTIVE;
            }
            return studentModuleStatus.LOCKED;
        } else if (statusRequested === studentModuleStatus.ACTIVE) {
            if (currentIndex < targetModuleIndex) {
                return studentModuleStatus.APPROVED;
            } else if (currentIndex === targetModuleIndex) {
                return studentModuleStatus.ACTIVE;
            }
            return studentModuleStatus.LOCKED;
        } else {
            return currentIndex === targetModuleIndex
                ? statusRequested
                : currentStatus;
        }
    }

    private buildStatusUpdatePromises(
        studentModules: StudentModule[],
        targetModuleIndex: number,
        statusRequested: StudentModuleStatus,
        transaction: Transaction
    ): Promise<any>[] {
        const updatePromises: Promise<any>[] = [];

        for (let currentIndex = 0; currentIndex < studentModules.length; currentIndex++) {
            const currentStudentModule = studentModules[currentIndex];

            if (!currentStudentModule) {
                continue;
            }

            const currentStatus = currentStudentModule.st_mod_status as StudentModuleStatus;
            const newContractStatus = this.calculateNewStudentModuleStatus(
                statusRequested,
                currentIndex,
                targetModuleIndex,
                currentStatus
            );

            if (currentStatus !== newContractStatus) {
                updatePromises.push(
                    currentStudentModule.update(
                        { st_mod_status: newContractStatus },
                        { transaction }
                    )
                );
            }
        }

        return updatePromises;
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
            order: [[{ model: Module, as: "module" }, "mo_name", "ASC"]]
        });
    }

    async getStudentContracts(studentId: string): Promise<StudentLevelEntity[]> {
        try {
            const studentContracts = await this.fetchAllStudentContractsWithSellers(studentId);
            return await this.convertToEntity(studentContracts);
        } catch (error) {
            throw error;
        }
    }

    async updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]> {
        const { contractId, status, studentId } = dto;

        try {
            const studentModulesOrdered = await this.fetchOrderedStudentModules(studentId);
            const targetContract = this.findTargetContract(studentModulesOrdered, contractId);

            const sequelize = StudentModule.sequelize;
            if (!sequelize) {
                throw CustomError.serviceUnavailable("Sequelize instance not found");
            }

            const transaction = await sequelize.transaction();

            try {
                const targetModuleIndex = studentModulesOrdered.findIndex(
                    contractItem => contractItem.st_mod_id === targetContract.st_mod_id
                );

                const updatePromises = this.buildStatusUpdatePromises(
                    studentModulesOrdered,
                    targetModuleIndex,
                    status,
                    transaction
                );

                await Promise.all(updatePromises);

                await transaction.commit();

                await targetContract.reload();

                return await this.convertToEntity(studentModulesOrdered);

            } catch (error) {
                await transaction.rollback();
                throw error;
            }

        } catch (error) {
            throw error;
        }
    }

    async deleteStudentLevel(contractId: string): Promise<boolean> {
        try {
            const targetContract = await this.fetchContractById(contractId);
            const studentId = targetContract.st_mod_student_id;

            const allStudentContracts = await this.fetchStudentContractsOrderedByName(studentId);

            const remainingContracts = allStudentContracts.filter(
                contractItem => contractItem.st_mod_id !== contractId
            );

            const sequelize = StudentModule.sequelize;
            if (!sequelize) {
                throw CustomError.serviceUnavailable("Sequelize instance not found");
            }

            const transaction = await sequelize.transaction();

            try {
                await targetContract.destroy({ transaction });

                const updatePromises = await this.selfHealingAlgorithm(remainingContracts, transaction);

                await Promise.all(updatePromises);

                await transaction.commit();

                return true;

            } catch (error) {
                await transaction.rollback();
                throw error;
            }

        } catch (error) {
            throw error;
        }
    }
}
