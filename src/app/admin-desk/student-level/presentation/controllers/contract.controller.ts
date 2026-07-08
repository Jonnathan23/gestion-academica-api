import {
    BlockLevel,
    DeleteStudentLevel,
    FinishCurrentLevel,
    GetStudentContracts,
    PurchaseModules,
    UnlockLevel,
} from "@/app/admin-desk/student-level/application/use-cases";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/student-level.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import { type LevelProgressionDomainService } from "@/app/admin-desk/student-level/domain/services/levelProgression.domain.service";
import type { StudentLevelRepositoryImpl } from "@/app/admin-desk/student-level/infrastructure/repositories/student-level.repository.impl";
import type { AuthRequest } from "@/core/middleware/auth.mid";
import type { Request, Response, NextFunction } from "express";
import { DeleteStudentLevelDto } from "@/app/admin-desk/student-level/application/dtos/delete-student-level.dto";
import { PurchaseModulesDto } from "@/app/admin-desk/student-level/application/dtos/purchase-modules.dto";
import { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/application/dtos/update-student-level.dto";
import type { StudentLevelValidators } from "@/app/admin-desk/student-level/application/dtos/validators/interfaces/student-level-validators.interface";
import { SuccessResponse } from "@/core/utils/success-response";

export class ContractController {
    public constructor(
        private readonly studentLevelRepository: StudentLevelRepositoryImpl,
        private readonly levelProgressionDomainService: LevelProgressionDomainService,
        private readonly validators: StudentLevelValidators,
    ) {}

    public purchaseModules = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { studentId } = req.params;
            const sellerId = (req as AuthRequest).userSession?.id;

            const purchaseModulesDto = PurchaseModulesDto.create(
                {
                    ...req.body,
                    studentId,
                    sellerId,
                },
                this.validators.purchaseModulesValidator,
            );

            const purchaseModules = new PurchaseModules(this.studentLevelRepository, this.levelProgressionDomainService);

            purchaseModules
                .execute(purchaseModulesDto)
                .then((contracts) => {
                    const successMessage = "Modules purchased successfully";

                    SuccessResponse.created<StudentLevelEntity[]>(res, successMessage, contracts);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public getStudentContracts = (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;

        const getStudentContracts = new GetStudentContracts(this.studentLevelRepository);

        getStudentContracts
            .execute(studentId as string)
            .then((contracts) => {
                const successMessage = "Contracts retrieved successfully";

                SuccessResponse.ok<StudentLevelDetailsProjection[]>(res, successMessage, contracts);
            })
            .catch((error) => {
                next(error);
            });
    };

    public deleteStudentLevel = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { studentLevelId } = req.params;

            const deleteStudentLevelDto = DeleteStudentLevelDto.create(
                {
                    studentLevelId,
                },
                this.validators.deleteStudentLevelValidator,
            );

            const deleteStudentLevel = new DeleteStudentLevel(this.studentLevelRepository, this.levelProgressionDomainService);

            deleteStudentLevel
                .execute(deleteStudentLevelDto.studentLevelId)
                .then(() => {
                    SuccessResponse.ok(res, "Student level deleted successfully");
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public blockLevel = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { studentLevelId, studentId } = req.params;

            const blockLevelDto = UpdateStudentLevelDto.create(
                {
                    studentLevelId,
                    studentId,
                },
                this.validators.updateStudentLevelValidator,
            );

            const blockLevel = new BlockLevel(this.studentLevelRepository);

            blockLevel
                .execute(blockLevelDto)
                .then(() => {
                    SuccessResponse.ok(res, "Student level blocked successfully");
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public unlockLevel = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { studentLevelId, studentId } = req.params;

            const unlockLevelDto = UpdateStudentLevelDto.create(
                {
                    studentLevelId,
                    studentId,
                },
                this.validators.updateStudentLevelValidator,
            );

            const unlockLevel = new UnlockLevel(this.studentLevelRepository);

            unlockLevel
                .execute(unlockLevelDto)
                .then(() => {
                    SuccessResponse.ok(res, "Student level unlocked successfully");
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public finishCurrentLevel = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { studentLevelId, studentId } = req.params;

            const finishCurrentLevelDto = UpdateStudentLevelDto.create(
                {
                    studentLevelId,
                    studentId,
                },
                this.validators.updateStudentLevelValidator,
            );

            const finishCurrentLevel = new FinishCurrentLevel(this.studentLevelRepository, this.levelProgressionDomainService);

            finishCurrentLevel
                .execute(finishCurrentLevelDto)
                .then(() => {
                    SuccessResponse.ok(res, "Student level finished successfully");
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };
}
