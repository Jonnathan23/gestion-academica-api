import PaymentPlan from "@/data/models/AdminDesk/PaymentPlan.model";
import type { Optional } from "sequelize";

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";

export const paymentQuotaStatus = {
    Pending: "PENDING",
    Partial: "PARTIAL",
    Paid: "PAID",
    Overdue: "OVERDUE",
} as const;

export type PaymentQuotaStatus = (typeof paymentQuotaStatus)[keyof typeof paymentQuotaStatus];

export const paymentMethod = {
    Cash: "CASH",
    Transfer: "TRANSFER",
    CreditCard: "CreditCard",
    Mixed: "MIXED",
} as const;

export type PaymentMethod = (typeof paymentMethod)[keyof typeof paymentMethod];

interface PaymentQuotaAttributes {
    pq_id: string;
    pq_payment_plan_id: string;
    pq_quota_number: number;
    pq_payment_method: PaymentMethod | null;
    pq_base_amount: number;
    pq_rollover_debt: number;
    pq_total_expected: number;
    pq_amount_paid: number;
    pq_due_date: Date;
    pq_status: PaymentQuotaStatus;
    pq_created_at: Date;
    pq_updated_at: Date;
}

interface PaymentQuotaCreationAttributes extends Optional<
    PaymentQuotaAttributes,
    "pq_id" | "pq_payment_method" | "pq_amount_paid" | "pq_created_at" | "pq_updated_at"
> {}

@Table({
    tableName: "PaymentQuotas",
    timestamps: true,
    createdAt: "pq_created_at",
    updatedAt: "pq_updated_at",
})
class PaymentQuota extends Model<PaymentQuotaAttributes, PaymentQuotaCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    declare pq_id: string;

    @ForeignKey(() => PaymentPlan)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare pq_payment_plan_id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare pq_quota_number: number;

    @Column({
        type: DataType.ENUM(...Object.values(paymentMethod)),
        allowNull: true, // Es nulo hasta que el estudiante realice el pago
    })
    declare pq_payment_method: PaymentMethod;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    declare pq_base_amount: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
    })
    declare pq_rollover_debt: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    declare pq_total_expected: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
    })
    declare pq_amount_paid: number;

    @Column({
        type: DataType.DATEONLY, // DATEONLY para evitar problemas de horas con los vencimientos
        allowNull: false,
    })
    declare pq_due_date: Date;

    @Column({
        type: DataType.ENUM(...Object.values(paymentQuotaStatus)),
        allowNull: false,
        defaultValue: paymentQuotaStatus.Pending,
    })
    declare pq_status: PaymentQuotaStatus;

    //* Relaciones

    @BelongsTo(() => PaymentPlan, "pq_payment_plan_id")
    declare payment_plan: PaymentPlan;
}

export default PaymentQuota;
