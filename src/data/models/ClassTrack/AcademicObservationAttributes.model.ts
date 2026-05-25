import type { Optional } from "sequelize";
import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import Student from "@/data/models/AdminDesk/Student.model";
import User from "@/data/models/Shared/User.model";

interface AcademicObservationAttributes {
    ac_ob_id: string;
    ac_ob_student_id: string;
    ac_ob_teacher_id: string;
    ac_ob_observation: string;
    ac_ob_deadline: Date | null;
    ac_ob_created_at: Date;
    ac_ob_updated_at: Date;
}

interface AcademicObservationCreationAttributes extends Optional<
    AcademicObservationAttributes,
    "ac_ob_id" | "ac_ob_deadline" | "ac_ob_created_at" | "ac_ob_updated_at"
> {}

@Table({
    tableName: "AcademicObservations",
    timestamps: true,
    createdAt: "ac_ob_created_at",
    updatedAt: "ac_ob_updated_at",
})
export default class AcademicObservation extends Model<AcademicObservationAttributes, AcademicObservationCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    declare ac_ob_id: string;

    @ForeignKey(() => Student)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare ac_ob_student_id: string;

    @BelongsTo(() => Student)
    declare student: Student;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare ac_ob_teacher_id: string;

    @BelongsTo(() => User)
    declare teacher: User;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare ac_ob_observation: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare ac_ob_deadline: Date;
}
