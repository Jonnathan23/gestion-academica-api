import {
    DeleteStudentLevel,
    GetStudentContracts,
    PurchaseModules,
    UpdateStudentLevel,
} from "@/app/admin-desk/student-level/application/useCases";
import { DeleteStudentLevelDto, PurchaseModulesDto, UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepositoryImpl } from "@/app/admin-desk/student-level/infrastructure/repositories/contract.repository.impl";
import { CustomError } from "@/core/error";
import { SuccessResponse } from "@/core/utils";
import type { Request, Response, NextFunction } from "express";

export class ContractController {
    constructor(private readonly studentLevelRepository: StudentLevelRepositoryImpl) {}

    purchaseModules = (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;
        const sellerId = (req as any).userSession?.id;

        const [error, purchaseModulesDto] = PurchaseModulesDto.create({
            ...req.body,
            studentId,
            sellerId,
        });

        if (error) throw CustomError.badRequest(error);

        const purchaseModules = new PurchaseModules(this.studentLevelRepository);

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

    getStudentContracts = (req: Request, res: Response, next: NextFunction) => {
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

    deleteStudentLevel = (req: Request, res: Response, next: NextFunction) => {
        const { studentLevelId } = req.params;

        const [error, deleteStudentLevelDto] = DeleteStudentLevelDto.create({
            studentLevelId,
        });

        if (error) throw CustomError.badRequest(error);

        const deleteStudentLevel = new DeleteStudentLevel(this.studentLevelRepository);

        deleteStudentLevel
            .execute(deleteStudentLevelDto!.studentLevelId)
            .then(() => {
                SuccessResponse.ok(res, "Student level deleted successfully");
            })
            .catch((error) => {
                next(error);
            });
    };

    updateStudentLevel = (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;

        const [error, updateStudentLevelDto] = UpdateStudentLevelDto.create({
            ...req.body,
            contractId: contractId?.toString(),
        });

        if (error) throw CustomError.badRequest(error);

        const updateStudentLevel = new UpdateStudentLevel(this.studentLevelRepository);

        updateStudentLevel
            .execute(updateStudentLevelDto!)
            .then((contracts) => {
                SuccessResponse.ok<StudentLevelEntity[]>(res, "Student level updated successfully", contracts);
            })
            .catch((error) => {
                next(error);
            });
    };
}
