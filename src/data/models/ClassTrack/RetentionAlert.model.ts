import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import Student from "@/data/models/AdminDesk/Student.model";
import User from "@/data/models/Shared/User.model";


const retentionAlertStatus = {
    PENDING: "PENDING",
    RESOLVED: "RESOLVED",
    CLOSED_FROZEN: "CLOSED_FROZEN"
} as const

export type RetentionAlertStatus = typeof retentionAlertStatus[keyof typeof retentionAlertStatus]

interface RetentionAlertAttributes {
    re_al_id: string;
    re_al_student_id: string;
    re_al_user_id: string;
    re_al_contact_date: Date;
    re_al_has_responded: boolean;
    re_al_days_absent: number;
    re_al_is_justified: boolean;
    re_al_justification_reason: string | null;
    re_al_return_deadline: Date | null;
    re_al_observations: string;
    re_al_status: RetentionAlertStatus;
    re_al_resolution_date: Date | null;
    re_al_created_at: Date;
    re_al_updated_at: Date;
}


@Table({
    tableName: "RetentionAlerts",
    timestamps: true,
    createdAt: 're_al_created_at',
    updatedAt: 're_al_updated_at'
})
class RetentionAlert extends Model<RetentionAlertAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4
    })
    declare re_al_id: string;

    @ForeignKey(() => Student)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare re_al_student_id: string;

    @BelongsTo(() => Student)
    declare student: Student;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare re_al_user_id: string;

    @BelongsTo(() => User)
    declare user: User;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare re_al_contact_date: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare re_al_has_responded: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare re_al_days_absent: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare re_al_is_justified: boolean;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare re_al_justification_reason: string;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare re_al_return_deadline: Date;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare re_al_observations: string;

    @Column({
        type: DataType.ENUM(...Object.values(retentionAlertStatus)),
        allowNull: false,
        defaultValue: retentionAlertStatus.PENDING
    })
    declare re_al_status: RetentionAlertStatus;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare re_al_resolution_date: Date;
}


export default RetentionAlert;
