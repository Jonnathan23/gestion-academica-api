import { PaymentPlanEntity } from "@/app/admin-desk/payments/domain/entities/PaymentPlanEntity";
import { PaymentQuotaEntity } from "@/app/admin-desk/payments/domain/entities/PaymentQuotaEntity";
import { CustomError } from "@/core/error";

export class PaymentMapper {

    public static quotaEntityFromObject(object: { [key: string]: any }): PaymentQuotaEntity {
        const { pq_id, pq_payment_plan_id, pq_quota_number, pq_payment_method, pq_base_amount,
            pq_rollover_debt, pq_total_expected, pq_amount_paid, pq_due_date, pq_status,
            pq_created_at, pq_updated_at } = object;

        if (!pq_id) throw CustomError.internalServer('Missing pq_id in PaymentQuota mapper');

        return new PaymentQuotaEntity(
            pq_id,
            pq_payment_plan_id,
            pq_quota_number,
            pq_payment_method,
            Number(pq_base_amount),
            Number(pq_rollover_debt),
            Number(pq_total_expected),
            Number(pq_amount_paid),
            new Date(pq_due_date),
            pq_status,
            pq_created_at,
            pq_updated_at
        );
    }

    public static planEntityFromObject(object: { [key: string]: any }): PaymentPlanEntity {
        const { pp_id, pp_student_id, pp_seller_id, pp_enrollment_fee, pp_total_amount, pp_is_single_payment,
            pp_status, payment_quotas, pp_created_at, pp_updated_at } = object;

        if (!pp_id) throw CustomError.internalServer('Missing pp_id in PaymentPlan mapper');

        const mappedQuotas = payment_quotas
            ? payment_quotas.map((quota: any) => this.quotaEntityFromObject(quota))
            : [];

        return new PaymentPlanEntity(
            pp_id,
            pp_student_id,
            pp_seller_id,
            Number(pp_enrollment_fee),
            Number(pp_total_amount),
            pp_is_single_payment,
            pp_status,
            mappedQuotas,
            pp_created_at,
            pp_updated_at
        );
    }
}