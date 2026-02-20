import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import Student from "@/data/models/AdminDesk/Student.model";
import Module from "@/data/models/AdminDesk/Module.model";
import User from "@/data/models/Shared/User.model";


const studentModuleStatus = {
    ACTIVE: "ACTIVE",
    CLOSED: "CLOSED",
    LOCKED: "LOCKED"
} as const

export type StudentModuleStatus = typeof studentModuleStatus[keyof typeof studentModuleStatus]

interface StudentModuleAttributes {
    st_mod_id: string;
    st_mod_student_id: string;
    st_mod_module_id: string;
    st_mod_seller_id: string;
    st_mod_status: StudentModuleStatus;
    st_mod_purchase_date: Date;
    st_mod_created_at: Date;
    st_mod_updated_at: Date;
}


@Table({
    tableName: "StudentModules",
    timestamps: true,
    createdAt: 'st_mod_created_at',
    updatedAt: 'st_mod_updated_at'
})
class StudentModule extends Model<StudentModuleAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4
    })
    declare st_mod_id: string;

    @ForeignKey(() => Student)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare st_mod_student_id: string;

    @BelongsTo(() => Student)
    declare student: Student;

    @ForeignKey(() => Module)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare st_mod_module_id: string;

    @BelongsTo(() => Module)
    declare module: Module;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare st_mod_seller_id: string;

    @BelongsTo(() => User)
    declare seller: User;

    @Column({
        type: DataType.ENUM(...Object.values(studentModuleStatus)),
        allowNull: false
    })
    declare st_mod_status: StudentModuleStatus;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare st_mod_purchase_date: Date;
}


export default StudentModule;
