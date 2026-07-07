import {
    BlockLevel,
    DeleteStudentLevel,
    FinishCurrentLevel,
    GetStudentContracts,
    PurchaseModules,
    UnlockLevel,
} from "@/app/admin-desk/student-level/application/use-cases";
import { DeleteStudentLevelDto, PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import { type LevelProgressionDomainService } from "@/app/admin-desk/student-level/domain/services/levelProgression.domain.service";
import type { StudentLevelRepositoryImpl } from "@/app/admin-desk/student-level/infrastructure/repositories/studentLevel.repository.impl";
import { CustomError } from "@/core/error";
import type { AuthRequest } from "@/core/middleware/auth.mid";
import { SuccessResponse } from "@/core/utils";
import type { Request, Response, NextFunction } from "express";

export class ContractController {
    public constructor(
        private readonly studentLevelRepository: StudentLevelRepositoryImpl,
        private readonly levelProgressionDomainService: LevelProgressionDomainService,
    ) {}

    public purchaseModules = (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;
        const sellerId = (req as AuthRequest).userSession?.id;

        const [error, purchaseModulesDto] = PurchaseModulesDto.create({
            ...req.body,
            studentId,
            sellerId,
        });

        if (error) throw CustomError.badRequest(error);

        const purchaseModules = new PurchaseModules(this.studentLevelRepository, this.levelProgressionDomainService);

        purchaseModules
            .execute(purchaseModulesDto!)
            .then((contracts) => {
                const successMessage = "Modules purchased successfully";

                SuccessResponse.created<StudentLevelEntity[]>(res, successMessage, contracts);
            })
            .catch((error) => {
                next(error);
            });
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
        const { studentLevelId } = req.params;

        const [error, deleteStudentLevelDto] = DeleteStudentLevelDto.create({
            studentLevelId,
        });

        if (error) throw CustomError.badRequest(error);

        const deleteStudentLevel = new DeleteStudentLevel(this.studentLevelRepository, this.levelProgressionDomainService);

        deleteStudentLevel
            .execute(deleteStudentLevelDto!.studentLevelId)
            .then(() => {
                SuccessResponse.ok(res, "Student level deleted successfully");
            })
            .catch((error) => {
                next(error);
            });
    };

    public blockLevel = (req: Request, res: Response, next: NextFunction) => {
        const { studentLevelId, studentId } = req.params;

        const [error, blockLevelDto] = UpdateStudentLevelDto.create({
            studentLevelId,
            studentId,
        });

        if (error) throw CustomError.badRequest(error);

        const blockLevel = new BlockLevel(this.studentLevelRepository);

        blockLevel
            .execute(blockLevelDto!)
            .then(() => {
                SuccessResponse.ok(res, "Student level blocked successfully");
            })
            .catch((error) => {
                next(error);
            });
    };

    public unlockLevel = (req: Request, res: Response, next: NextFunction) => {
        const { studentLevelId, studentId } = req.params;

        const [error, unlockLevelDto] = UpdateStudentLevelDto.create({
            studentLevelId,
            studentId,
        });

        if (error) throw CustomError.badRequest(error);

        const unlockLevel = new UnlockLevel(this.studentLevelRepository);

        unlockLevel
            .execute(unlockLevelDto!)
            .then(() => {
                SuccessResponse.ok(res, "Student level unlocked successfully");
            })
            .catch((error) => {
                next(error);
            });
    };

    public finishCurrentLevel = (req: Request, res: Response, next: NextFunction) => {
        const { studentLevelId, studentId } = req.params;

        const [error, finishCurrentLevelDto] = UpdateStudentLevelDto.create({
            studentLevelId,
            studentId,
        });

        if (error) throw CustomError.badRequest(error);

        const finishCurrentLevel = new FinishCurrentLevel(this.studentLevelRepository, this.levelProgressionDomainService);

        finishCurrentLevel
            .execute(finishCurrentLevelDto!)
            .then(() => {
                SuccessResponse.ok(res, "Student level finished successfully");
            })
            .catch((error) => {
                next(error);
            });
    };
}
