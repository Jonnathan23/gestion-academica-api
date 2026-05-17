import type { Request, Response, NextFunction } from "express";

import { PurchaseModules, GetStudentContracts, UpdateStudentLevel, DeleteStudentLevel } from "@/app/admin-desk/student-level/application";
import { PurchaseModulesDto, UpdateStudentLevelDto, DeleteStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import { SuccessResponse } from "@/core/utils";
import { CustomError } from "@/core/error";

export class ContractController {
    constructor(
        private readonly StudentLevelRepository: StudentLevelRepository
    ) { }

    purchaseModules = (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;
        const sellerId = (req as any).userSession?.id;

        const [error, purchaseModulesDto] = PurchaseModulesDto.create({
            ...req.body,
            studentId,
            sellerId
        });

        if (error) throw CustomError.badRequest(error);

        const purchaseModules = new PurchaseModules(this.StudentLevelRepository);

        purchaseModules.execute(purchaseModulesDto!)
            .then(contracts => {
                const successMessage = "Modules purchased successfully";
                SuccessResponse.created<StudentLevelEntity[]>(res, successMessage, contracts);
            })
            .catch(error => { next(error); });
    }

    getStudentContracts = (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;

        const getStudentContracts = new GetStudentContracts(this.StudentLevelRepository);

        getStudentContracts.execute(studentId as string)
            .then(contracts => {

                const successMessage = "Contracts retrieved successfully";
                SuccessResponse.ok<StudentLevelDetailsProjection[]>(res, successMessage, contracts);
            })
            .catch(error => {

                next(error);
            });
    }

    deleteStudentLevel = (req: Request, res: Response, next: NextFunction) => {
        const { studentLevelId } = req.params;

        const [error, deleteStudentLevelDto] = DeleteStudentLevelDto.create({
            studentLevelId
        });

        if (error) throw CustomError.badRequest(error);

        const deleteStudentLevel = new DeleteStudentLevel(this.StudentLevelRepository);

        deleteStudentLevel.execute(deleteStudentLevelDto!.studentLevelId)
            .then(() => {
                SuccessResponse.ok(res, "Student level deleted successfully");
            })
            .catch(error => { next(error); });
    }

    updateStudentLevel = (req: Request, res: Response, next: NextFunction) => {
        const { contractId } = req.params;

        const [error, updateStudentLevelDto] = UpdateStudentLevelDto.create({
            ...req.body,
            contractId: contractId?.toString(),
        });

        if (error) throw CustomError.badRequest(error);

        const updateStudentLevel = new UpdateStudentLevel(this.StudentLevelRepository);

        updateStudentLevel.execute(updateStudentLevelDto!)
            .then(contracts => {
                SuccessResponse.ok<StudentLevelEntity[]>(res, "Student level updated successfully", contracts);
            })
            .catch(error => { next(error); });
    }
}
