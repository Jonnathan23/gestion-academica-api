import { CustomError } from "@/core/error";
import type { StudentLevelDataSource } from "@/app/AdminDesk/contracts/domain/datasource/contract.datasource";
import type { PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/AdminDesk/contracts/domain/dtos";
import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";
import { StudentLevelMapper } from "@/app/AdminDesk/contracts/infrastructure/mappers/contract.mapper";
import { StudentModule, Module } from "@/data/models/AdminDesk";
import { User } from "@/data/models/Shared";
import { studentModuleStatus, type StudentModuleStatus } from "@/app/AdminDesk/contracts/domain";

export class StudentLevelDataSourceImpl implements StudentLevelDataSource {

    async purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]> {
        const { studentId, sellerId, moduleIds } = dto;
        try {
            const sequelize = StudentModule.sequelize;
            if (!sequelize) throw CustomError.serviceUnavailable("Sequelize instance not found");

            const modulesFromDb = await Module.findAll({
                where: { mo_id: moduleIds },
                order: [['mo_name', 'ASC']]
            });

            if (modulesFromDb.length !== moduleIds.length) {
                throw CustomError.badRequest("One or more provided modules do not exist in the database");
            }

            const transaction = await sequelize.transaction();
            try {
                const recordsToInsert = modulesFromDb.map((currentModule, index) => ({
                    st_mod_student_id: studentId,
                    st_mod_module_id: currentModule.mo_id,
                    st_mod_seller_id: sellerId,
                    st_mod_status: index === 0 ? studentModuleStatus.ACTIVE : studentModuleStatus.LOCKED,
                    st_mod_purchase_date: new Date()
                }));

                const createdContracts = await StudentModule.bulkCreate(recordsToInsert, { transaction });

                await transaction.commit();

                const createdContractIds = createdContracts.map(contract => contract.st_mod_id);

                const completeStudentLevels = await StudentModule.findAll({
                    where: { st_mod_id: createdContractIds },
                    include: [{ model: Module }],
                    order: [[Module, 'mo_name', 'ASC']]
                });

                return completeStudentLevels.map(studentLevel =>
                    StudentLevelMapper.studentLevelEntityFromObject(studentLevel.toJSON())
                );

            } catch (error) {
                await transaction.rollback();
                throw error;
            }

        } catch (error) {
            throw error;
        }
    }

    async getStudentContracts(studentId: string): Promise<StudentLevelEntity[]> {
        try {
            const contracts = await StudentModule.findAll({
                where: { st_mod_student_id: studentId },
                include: [
                    { model: Module }, // optional: attributes: [] to limit
                    { model: User, as: 'seller' } // Based on the association we might need this
                ]
            });

            return contracts.map(contract => StudentLevelMapper.studentLevelEntityFromObject(contract.toJSON()));
        } catch (error) {
            throw error;
        }
    }

    async updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]> {
        const { contractId, status, studentId } = dto;

        try {
            const allModulesBought = await StudentModule.findAll({
                where: { st_mod_student_id: studentId },
                include: [
                    { model: Module }
                ]
            });

            if (!allModulesBought.length) {
                throw CustomError.notFound("Student modules not found");
            }

            // 2. Buscamos el contrato objetivo
            const targetContract = allModulesBought.find(contractItem => contractItem.st_mod_id === contractId);

            if (!targetContract) {
                throw CustomError.notFound("Contract not found");
            }

            const modulesBoughtOrdered = allModulesBought.sort((firstModule, secondModule) =>
                firstModule.module.mo_name.localeCompare(secondModule.module.mo_name)
            );

            const sequelize = StudentModule.sequelize;
            if (!sequelize) throw CustomError.serviceUnavailable("Sequelize instance not found");

            const transaction = await sequelize.transaction();

            try {
                const targetModuleIndex = modulesBoughtOrdered.findIndex(
                    contractItem => contractItem.st_mod_id === targetContract.st_mod_id
                );

                const updatePromises: Promise<any>[] = [];

                for (let currentIndex = 0; currentIndex < modulesBoughtOrdered.length; currentIndex++) {
                    const currentStudentModule = modulesBoughtOrdered[currentIndex];

                    if (!currentStudentModule) continue;

                    let newContractStatus: StudentModuleStatus;

                    if (status === studentModuleStatus.APPROVED) {
                        if (currentIndex <= targetModuleIndex) {
                            newContractStatus = studentModuleStatus.APPROVED;

                        } else if (currentIndex === targetModuleIndex + 1) {
                            newContractStatus = studentModuleStatus.ACTIVE;

                        } else {
                            newContractStatus = studentModuleStatus.LOCKED;
                        }

                    } else if (status === studentModuleStatus.ACTIVE) {
                        if (currentIndex < targetModuleIndex) {
                            newContractStatus = studentModuleStatus.APPROVED;

                        } else if (currentIndex === targetModuleIndex) {
                            newContractStatus = studentModuleStatus.ACTIVE;

                        } else {
                            newContractStatus = studentModuleStatus.LOCKED;
                        }

                    } else {
                        newContractStatus = currentIndex === targetModuleIndex
                            ? status
                            : currentStudentModule.st_mod_status as StudentModuleStatus;
                    }

                    // Optimización: Solo enviamos la actualización a la BD si el estado realmente cambió
                    if (currentStudentModule.st_mod_status !== newContractStatus) {
                        updatePromises.push(
                            currentStudentModule.update(
                                { st_mod_status: newContractStatus },
                                { transaction }
                            )
                        );
                    }
                }

                // Ejecutamos todas las actualizaciones en paralelo
                await Promise.all(updatePromises);

                await transaction.commit();

                // Recargamos el contrato objetivo para devolverlo con su nuevo estado
                await targetContract.reload();

                const studentModulesEntities = allModulesBought.map(contract => StudentLevelMapper.studentLevelEntityFromObject(contract.toJSON()));
                return studentModulesEntities;

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
            // 1. Buscamos el contrato que vamos a eliminar para obtener el ID del estudiante
            const targetContract = await StudentModule.findByPk(contractId);

            if (!targetContract) {
                throw CustomError.notFound("Contract not found");
            }

            const studentId = targetContract.st_mod_student_id;

            // 2. Traemos TODOS los contratos del estudiante con su módulo anidado
            const allStudentContracts = await StudentModule.findAll({
                where: { st_mod_student_id: studentId },
                include: [{ model: Module }],
                order: [[Module, 'mo_name', 'ASC']]
            });

            // 3. Filtramos en memoria para obtener los contratos RESTANTES
            const remainingContracts = allStudentContracts.filter(
                contractItem => contractItem.st_mod_id !== contractId
            );

            const sequelize = StudentModule.sequelize;
            if (!sequelize) throw CustomError.serviceUnavailable("Sequelize instance not found");

            const transaction = await sequelize.transaction();

            try {
                // 4. Eliminamos el contrato equivocado de la base de datos
                await targetContract.destroy({ transaction });

                const updatePromises: Promise<any>[] = [];
                let isProgressionActive = false;

                // 5. Algoritmo de Auto-Sanación para los contratos restantes
                for (let currentIndex = 0; currentIndex < remainingContracts.length; currentIndex++) {
                    const currentContract = remainingContracts[currentIndex];
                    if (!currentContract) continue;

                    let newContractStatus: StudentModuleStatus = currentContract.st_mod_status as StudentModuleStatus;

                    if (!isProgressionActive) {
                        // Mientras no hayamos activado la progresión, respetamos los APPROVED.
                        // El primero que NO sea APPROVED, se convierte en el ACTIVE.
                        if (currentContract.st_mod_status !== studentModuleStatus.APPROVED) {
                            newContractStatus = studentModuleStatus.ACTIVE;
                            isProgressionActive = true;
                        }
                    } else {
                        // Si ya activamos un módulo, todos los siguientes son estrictamente LOCKED
                        newContractStatus = studentModuleStatus.LOCKED;
                    }

                    // Optimización: Solo actualizamos si el estado realmente necesita cambiar
                    if (currentContract.st_mod_status !== newContractStatus) {
                        updatePromises.push(
                            currentContract.update(
                                { st_mod_status: newContractStatus },
                                { transaction }
                            )
                        );
                    }
                }

                // Ejecutamos las actualizaciones de sanación en paralelo
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
