import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import type { Optional } from "sequelize";

import Student from "@/data/models/admin-desk/Student.model";
import { User } from "@/data/models/shared";
import PaymentQuota from "@/data/models/admin-desk/PaymentQuota.model";

export const paymentPlanStatus = {
    Pending: "PENDING",
    Completed: "Completed",
    Cancelled: "CANCELLED",
} as const;

export type PaymentPlanStatus = (typeof paymentPlanStatus)[keyof typeof paymentPlanStatus];

interface PaymentPlanAttributes {
    pp_id: string;
    pp_student_id: string;
    pp_seller_id: string;
    pp_enrollment_fee: number;
    pp_total_amount: number;
    pp_is_single_payment: boolean;
    pp_status: PaymentPlanStatus;
    pp_created_at: Date;
    pp_updated_at: Date;
}

interface PaymentPlanCreationAttributes extends Optional<PaymentPlanAttributes, "pp_id" | "pp_created_at" | "pp_updated_at"> {}

const MAX_DECIMAL_PAYMENT: number = 10;
const PRECISION_DECIMAL_PAYMENT: number = 2;

@Table({
    tableName: "PaymentPlans",
    timestamps: true,
    createdAt: "pp_created_at",
    updatedAt: "pp_updated_at",
})
class PaymentPlan extends Model<PaymentPlanAttributes, PaymentPlanCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    declare public pp_id: string;

    @ForeignKey(() => Student)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare public pp_student_id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare public pp_seller_id: string;

    @Column({
        type: DataType.DECIMAL(MAX_DECIMAL_PAYMENT, PRECISION_DECIMAL_PAYMENT),
        allowNull: false,
        defaultValue: 0.0,
    })
    declare public pp_enrollment_fee: number;

    @Column({
        type: DataType.DECIMAL(MAX_DECIMAL_PAYMENT, PRECISION_DECIMAL_PAYMENT),
        allowNull: false,
    })
    declare public pp_total_amount: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare public pp_is_single_payment: boolean;

    @Column({
        type: DataType.ENUM(...Object.values(paymentPlanStatus)),
        allowNull: false,
        defaultValue: paymentPlanStatus.Pending,
    })
    declare public pp_status: PaymentPlanStatus;

    //* Relaciones

    @BelongsTo(() => Student, "pp_student_id")
    declare public student: Student;

    @BelongsTo(() => User, "pp_seller_id")
    declare public seller: User;

    @HasMany(() => PaymentQuota, "pq_payment_plan_id")
    declare public payment_quotas: PaymentQuota[];
}

export default PaymentPlan;
