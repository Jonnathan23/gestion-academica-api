import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import Student from "@/data/models/admin-desk/Student.model";
import Module from "@/data/models/admin-desk/Module.model";
import User from "@/data/models/shared/User.model";

const studentModuleStatus = {
    Active: "ACTIVE",
    Approved: "APPROVED",
    Locked: "LOCKED",
    Frozen: "FROZEN",
} as const;

export type StudentModuleStatus = (typeof studentModuleStatus)[keyof typeof studentModuleStatus];

interface StudentModuleAttributes {
    st_mod_id: string;
    st_mod_student_id: string;
    st_mod_module_id: string;
    st_mod_seller_id: string;
    st_mod_status: StudentModuleStatus;
    st_mod_purchase_date: Date;
    st_mod_freeze_count: number;
    st_mod_reactivation_count: number;
    st_mod_created_at: Date;
    st_mod_updated_at: Date;
}

interface StudentModuleCreationAttributes extends Omit<StudentModuleAttributes, "st_mod_id" | "st_mod_created_at" | "st_mod_updated_at"> {}

@Table({
    tableName: "StudentModules",
    timestamps: true,
    createdAt: "st_mod_created_at",
    updatedAt: "st_mod_updated_at",
})
class StudentModule extends Model<StudentModuleAttributes, StudentModuleCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    declare st_mod_id: string;

    @Column({
        type: DataType.ENUM(...Object.values(studentModuleStatus)),
        allowNull: false,
    })
    declare st_mod_status: StudentModuleStatus;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    declare st_mod_purchase_date: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    declare st_mod_freeze_count: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    declare st_mod_reactivation_count: number;

    //* Foreign Keys
    @ForeignKey(() => Student)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare st_mod_student_id: string;

    @BelongsTo(() => Student)
    declare student: Student;

    @ForeignKey(() => Module)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare st_mod_module_id: string;

    @BelongsTo(() => Module)
    declare module: Module;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare st_mod_seller_id: string;

    @BelongsTo(() => User)
    declare seller: User;
}

export default StudentModule;

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentModule:
 *       type: object
 *       required:
 *         - st_mod_id
 *         - st_mod_student_id
 *         - st_mod_module_id
 *         - st_mod_seller_id
 *         - st_mod_status
 *         - st_mod_purchase_date
 *       properties:
 *         st_mod_id:
 *           type: string
 *           format: uuid
 *           description: Identificador único de la relación estudiante-módulo (Generado automáticamente)
 *         st_mod_student_id:
 *           type: string
 *           format: uuid
 *           description: ID del estudiante asociado (FK → Students)
 *         st_mod_module_id:
 *           type: string
 *           format: uuid
 *           description: ID del módulo adquirido (FK → Modules)
 *         st_mod_seller_id:
 *           type: string
 *           format: uuid
 *           description: ID del usuario (asesor/vendedor) que gestionó la venta (FK → Users)
 *         st_mod_status:
 *           type: string
 *           enum: [ACTIVE, CLOSED, LOCKED]
 *           description: Estado actual del módulo para el estudiante
 *         st_mod_purchase_date:
 *           type: string
 *           format: date-time
 *           description: Fecha en que el estudiante adquirió el módulo
 *         st_mod_created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro
 *         st_mod_updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la última actualización del registro
 */
