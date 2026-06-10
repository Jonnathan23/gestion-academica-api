import { Transaction } from "sequelize";

import type { PaymentDataSource } from "@/app/admin-desk/payments/domain/datasource";
import type { CreatePaymentPlanDto, PayQuotaDto } from "@/app/admin-desk/payments/domain/dtos";
import type { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/PaymentPlanEntity";
import type { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/PaymentQuotaEntity";
import { paymentPlanStatus, paymentQuotaStatus, type PaymentQuotaStatus } from "@/app/admin-desk/payments/domain/interfaces";
import { PaymentMapper } from "@/app/admin-desk/payments/infrastructure/mappers/payment.mapper";
import { CustomError } from "@/core/error";
import PaymentPlanModel from "@/data/models/admin-desk/PaymentPlan.model";
import PaymentQuotaModel from "@/data/models/admin-desk/PaymentQuota.model";

export class PaymentDataSourceImpl implements PaymentDataSource {
    constructor() {}

    //* PUBLIC METHODS (ORCHESTRATORS)

    async createPaymentPlan(dto: CreatePaymentPlanDto, generatedQuotas: PaymentQuotaEntity[]): Promise<PaymentPlanEntity> {
        return await PaymentPlanModel.sequelize!.transaction(async (transaction) => {
            const createdPlan = await this._insertPaymentPlan(dto, transaction);
            const createdQuotas = await this._insertGeneratedQuotas(createdPlan.pp_id, generatedQuotas, transaction);

            return PaymentMapper.planEntityFromObject({
                ...createdPlan.toJSON(),
                payment_quotas: createdQuotas.map((quota) => quota.toJSON()),
            });
        });
    }

    async getStudentPaymentPlans(studentId: string): Promise<PaymentPlanEntity[]> {
        const plans = await PaymentPlanModel.findAll({
            where: { pp_student_id: studentId },
            include: [
                {
                    model: PaymentQuotaModel,
                    as: "payment_quotas",
                },
            ],
            order: [
                ["pp_created_at", "DESC"],
                ["payment_quotas", "pq_quota_number", "ASC"],
            ],
        });

        return plans.map((plan) => PaymentMapper.planEntityFromObject(plan.toJSON()));
    }

    async processQuotaPayment(dto: PayQuotaDto): Promise<PaymentQuotaEntity> {
        return await PaymentQuotaModel.sequelize!.transaction(async (transaction) => {
            const currentQuota = await this._findAndValidateQuotaForPayment(dto.quotaId, dto.amountPaid, transaction);

            const expectedAmount = Number(currentQuota.pq_total_expected);
            const remainingDebt = expectedAmount - (Number(currentQuota.pq_amount_paid) + dto.amountPaid);

            await this._applyPaymentUpdate(currentQuota, dto, expectedAmount, transaction);

            if (remainingDebt > 0) {
                await this._addRolloverDebtToNextQuota(currentQuota, remainingDebt, transaction);
            }

            return PaymentMapper.quotaEntityFromObject(currentQuota.toJSON());
        });
    }

    async revertQuotaPayment(quotaId: string): Promise<boolean> {
        return await PaymentQuotaModel.sequelize!.transaction(async (transaction) => {
            const currentQuota = await this._findQuotaOrThrow(quotaId, transaction);

            const previousAmountPaid = Number(currentQuota.pq_amount_paid);
            const expectedAmount = Number(currentQuota.pq_total_expected);
            const rolledOverDebt = expectedAmount - previousAmountPaid;

            await this._revertCurrentQuotaToPending(currentQuota, transaction);

            if (rolledOverDebt > 0) {
                await this._subtractRolloverDebtFromNextQuota(currentQuota, rolledOverDebt, transaction);
            }

            return true;
        });
    }

    //* PRIVATE METHODS (WORKERS)

    private async _insertPaymentPlan(dto: CreatePaymentPlanDto, transaction: Transaction): Promise<PaymentPlanModel> {
        return await PaymentPlanModel.create(
            {
                pp_student_id: dto.studentId,
                pp_seller_id: dto.sellerId,
                pp_enrollment_fee: dto.enrollmentFee,
                pp_total_amount: dto.totalAmount,
                pp_is_single_payment: dto.isSinglePayment,
                pp_status: paymentPlanStatus.Pending,
            },
            { transaction },
        );
    }

    private async _insertGeneratedQuotas(
        planId: string,
        generatedQuotas: PaymentQuotaEntity[],
        transaction: Transaction,
    ): Promise<PaymentQuotaModel[]> {
        const quotasToInsert = generatedQuotas.map((quota) => ({
            pq_payment_plan_id: planId,
            pq_quota_number: quota.quotaNumber,
            pq_base_amount: quota.baseAmount,
            pq_rollover_debt: quota.rolloverDebt,
            pq_total_expected: quota.totalExpected,
            pq_due_date: quota.dueDate,
            pq_status: quota.status as PaymentQuotaStatus,
        }));

        return await PaymentQuotaModel.bulkCreate(quotasToInsert, { transaction });
    }

    private async _findQuotaOrThrow(quotaId: string, transaction: Transaction): Promise<PaymentQuotaModel> {
        const quota = await PaymentQuotaModel.findByPk(quotaId, { transaction });
        if (!quota) {
            throw CustomError.notFound("Payment Quota not found");
        }
        return quota;
    }

    private async _findAndValidateQuotaForPayment(
        quotaId: string,
        amountPaid: number,
        transaction: Transaction,
    ): Promise<PaymentQuotaModel> {
        const quota = await this._findQuotaOrThrow(quotaId, transaction);

        if (quota.pq_status === paymentQuotaStatus.Paid) {
            throw CustomError.badRequest("This quota is already fully paid");
        }

        const expectedAmount = Number(quota.pq_total_expected);
        if (amountPaid > expectedAmount) {
            throw CustomError.badRequest(`Amount paid cannot exceed the expected total of $${expectedAmount}`);
        }

        return quota;
    }

    private async _applyPaymentUpdate(
        quota: PaymentQuotaModel,
        dto: PayQuotaDto,
        expectedAmount: number,
        transaction: Transaction,
    ): Promise<void> {
        const newAmountPaid = Number(quota.pq_amount_paid) + dto.amountPaid;
        const newStatus = newAmountPaid >= expectedAmount ? paymentQuotaStatus.Paid : paymentQuotaStatus.Partial;

        await quota.update(
            {
                pq_amount_paid: newAmountPaid,
                pq_payment_method: dto.paymentMethod,
                pq_status: newStatus,
            },
            { transaction },
        );
    }

    private async _addRolloverDebtToNextQuota(
        currentQuota: PaymentQuotaModel,
        remainingDebt: number,
        transaction: Transaction,
    ): Promise<void> {
        const nextQuota = await PaymentQuotaModel.findOne({
            where: {
                pq_payment_plan_id: currentQuota.pq_payment_plan_id,
                pq_quota_number: currentQuota.pq_quota_number + 1,
            },
            transaction,
        });

        if (nextQuota) {
            const newRollover = Number(nextQuota.pq_rollover_debt) + remainingDebt;
            const newExpected = Number(nextQuota.pq_base_amount) + newRollover;
            await nextQuota.update(
                {
                    pq_rollover_debt: newRollover,
                    pq_total_expected: newExpected,
                },
                { transaction },
            );
        } else {
            const nextMonthDate = new Date(currentQuota.pq_due_date);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

            await PaymentQuotaModel.create(
                {
                    pq_payment_plan_id: currentQuota.pq_payment_plan_id,
                    pq_quota_number: currentQuota.pq_quota_number + 1,
                    pq_base_amount: 0.0,
                    pq_rollover_debt: remainingDebt,
                    pq_total_expected: remainingDebt,
                    pq_due_date: nextMonthDate,
                    pq_status: paymentQuotaStatus.Pending,
                },
                { transaction },
            );
        }
    }

    private async _revertCurrentQuotaToPending(quota: PaymentQuotaModel, transaction: Transaction): Promise<void> {
        await quota.update(
            {
                pq_amount_paid: 0,
                pq_payment_method: null,
                pq_status: paymentQuotaStatus.Pending,
            },
            { transaction },
        );
    }

    private async _subtractRolloverDebtFromNextQuota(
        currentQuota: PaymentQuotaModel,
        rolledOverDebt: number,
        transaction: Transaction,
    ): Promise<void> {
        const nextQuota = await PaymentQuotaModel.findOne({
            where: {
                pq_payment_plan_id: currentQuota.pq_payment_plan_id,
                pq_quota_number: currentQuota.pq_quota_number + 1,
            },
            transaction,
        });

        if (nextQuota) {
            const currentBase = Number(nextQuota.pq_base_amount);
            const newRollover = Number(nextQuota.pq_rollover_debt) - rolledOverDebt;

            if (currentBase === 0 && newRollover <= 0) {
                await nextQuota.destroy({ transaction });
            } else {
                const newExpected = currentBase + newRollover;
                await nextQuota.update(
                    {
                        pq_rollover_debt: newRollover,
                        pq_total_expected: newExpected,
                    },
                    { transaction },
                );
            }
        }
    }
}
