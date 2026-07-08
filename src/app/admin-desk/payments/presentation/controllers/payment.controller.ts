import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "@/core/middleware/auth.mid";

import type { PaymentRepository } from "@/app/admin-desk/payments/domain/repositories/payment.repository";
import { CreatePaymentPlanUseCase } from "@/app/admin-desk/payments/application/use-cases/create-payment.use-case";
import { GetStudentPaymentPlansUseCase } from "@/app/admin-desk/payments/application/use-cases/get-student-payment-plans.use-case";
import { ProcessQuotaPaymentUseCase } from "@/app/admin-desk/payments/application/use-cases/process-quota-payment.use-case";
import { RevertQuotaPaymentUseCase } from "@/app/admin-desk/payments/application/use-cases/revert-quota-payment.use-case";
import { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/payment-plan.entity";
import { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/payment-quota.entity";
import { CreatePaymentPlanDto } from "@/app/admin-desk/payments/application/dtos/create-payment-plan.dto";
import { PayQuotaDto } from "@/app/admin-desk/payments/application/dtos/pay-quota.dto";
import { SuccessResponse } from "@/core/utils/success-response";
import type { PaymentValidators } from "@/app/admin-desk/payments/application/dtos/validators/interfaces/payment-validators.interface";

export class PaymentController {
    public constructor(
        private readonly paymentRepository: PaymentRepository,
        private readonly validators: PaymentValidators,
    ) {}

    public createPaymentPlan = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { studentId } = req.params;
            const sellerId = (req as AuthRequest).userSession?.id;

            const createPaymentPlanDto = CreatePaymentPlanDto.create(
                {
                    ...req.body,
                    studentId,
                    sellerId,
                },
                this.validators.createPaymentPlanValidator,
            );

            const createPaymentPlan = new CreatePaymentPlanUseCase(this.paymentRepository);

            createPaymentPlan
                .execute(createPaymentPlanDto)
                .then((paymentPlan) => {
                    SuccessResponse.created<PaymentPlanEntity>(res, "Payment plan created successfully", paymentPlan);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public getStudentPaymentPlans = (req: Request, res: Response, next: NextFunction) => {
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

    public processQuotaPayment = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { quotaId } = req.params;

            const payQuotaDto = PayQuotaDto.create(
                {
                    ...req.body,
                    quotaId,
                },
                this.validators.payQuotaValidator,
            );

            const processQuotaPayment = new ProcessQuotaPaymentUseCase(this.paymentRepository);

            processQuotaPayment
                .execute(payQuotaDto)
                .then((updatedQuota) => {
                    SuccessResponse.ok<PaymentQuotaEntity>(res, "Payment processed successfully", updatedQuota);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public revertQuotaPayment = (req: Request, res: Response, next: NextFunction) => {
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
