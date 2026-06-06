import type { NextFunction, Request, Response } from "express";

import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/Payment.repository";
import { CreatePaymentPlanUseCase } from "@/app/admin-desk/payments/application/use-cases/createPayment.use-case";
import { GetStudentPaymentPlansUseCase } from "@/app/admin-desk/payments/application/use-cases/getStudentPaymentPlans.use-case";
import { ProcessQuotaPaymentUseCase } from "@/app/admin-desk/payments/application/use-cases/processQuotaPayment.use-case";
import { RevertQuotaPaymentUseCase } from "@/app/admin-desk/payments/application/use-cases/revertQuotaPayment.use-case";
import { CreatePaymentPlanDto } from "@/app/admin-desk/payments/domain/dtos";
import { PayQuotaDto } from "@/app/admin-desk/payments/domain/dtos";
import { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/PaymentPlanEntity";
import { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/PaymentQuotaEntity";
import { CustomError } from "@/core/error";
import { SuccessResponse } from "@/core/utils";

export class PaymentController {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    createPaymentPlan = (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;
        const sellerId = (req as any).userSession?.id;

        const [error, createPaymentPlanDto] = CreatePaymentPlanDto.create({
            ...req.body,
            studentId,
            sellerId,
        });

        if (error) throw CustomError.badRequest(error);

        const createPaymentPlan = new CreatePaymentPlanUseCase(this.paymentRepository);

        createPaymentPlan
            .execute(createPaymentPlanDto!)
            .then((paymentPlan) => {
                SuccessResponse.created<PaymentPlanEntity>(res, "Payment plan created successfully", paymentPlan);
            })
            .catch((error) => {
                next(error);
            });
    };

    getStudentPaymentPlans = (req: Request, res: Response, next: NextFunction) => {
        const { studentId } = req.params;

        const getStudentPaymentPlans = new GetStudentPaymentPlansUseCase(this.paymentRepository);

        getStudentPaymentPlans
            .execute(studentId as string)
            .then((paymentPlans) => {
                SuccessResponse.ok<PaymentPlanEntity[]>(res, "Payment plans retrieved successfully", paymentPlans);
            })
            .catch((error) => {
                next(error);
            });
    };

    processQuotaPayment = (req: Request, res: Response, next: NextFunction) => {
        const { quotaId } = req.params;

        const [error, payQuotaDto] = PayQuotaDto.create({
            ...req.body,
            quotaId,
        });

        if (error) throw CustomError.badRequest(error);

        const processQuotaPayment = new ProcessQuotaPaymentUseCase(this.paymentRepository);

        processQuotaPayment
            .execute(payQuotaDto!)
            .then((updatedQuota) => {
                SuccessResponse.ok<PaymentQuotaEntity>(res, "Payment processed successfully", updatedQuota);
            })
            .catch((error) => {
                next(error);
            });
    };

    revertQuotaPayment = (req: Request, res: Response, next: NextFunction) => {
        const { quotaId } = req.params;

        const revertQuotaPayment = new RevertQuotaPaymentUseCase(this.paymentRepository);

        revertQuotaPayment
            .execute(quotaId as string)
            .then(() => {
                SuccessResponse.ok<null>(res, "Payment reverted successfully", null);
            })
            .catch((error) => {
                next(error);
            });
    };
}
