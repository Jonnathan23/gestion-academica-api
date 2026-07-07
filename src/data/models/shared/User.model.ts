import { Column, Table, DataType, Model, HasMany } from "sequelize-typescript";
import StudentModule from "@/data/models/admin-desk/StudentModule.model";
import AttendanceSession from "@/data/models/class-track/AttendanceSession.model";
import RetentionAlert from "@/data/models/class-track/RetentionAlert.model";
import type { Optional } from "sequelize";

export const userRoles = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER",
    ADVISOR: "ADVISOR",
    ACADEMIC_DIRECTOR: "ACADEMIC_DIRECTOR",
} as const;

export type UserRoles = (typeof userRoles)[keyof typeof userRoles];

interface UserAttributes {
    us_id: string;
    us_full_name: string;
    us_email: string;
    us_password_hash: string;
    us_role: UserRoles;
    us_is_active: boolean;
    us_created_at: Date;
    us_updated_at: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "us_id" | "us_is_active" | "us_created_at" | "us_updated_at"> {}

@Table({
    tableName: "Users",
    timestamps: true,
    createdAt: "us_created_at",
    updatedAt: "us_updated_at",
})
class User extends Model<UserAttributes, UserCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    declare public us_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare public us_full_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare public us_email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare public us_password_hash: string;

    @Column({
        type: DataType.ENUM(...Object.values(userRoles)),
        allowNull: false,
    })
    declare public us_role: UserRoles;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    declare public us_is_active: boolean;

    //* Relaciones (Has Many)

    @HasMany(() => StudentModule, "st_mod_seller_id")
    declare public sold_modules: StudentModule[];

    @HasMany(() => AttendanceSession, "at_se_teacher_id")
    declare public overseen_sessions: AttendanceSession[];

    @HasMany(() => RetentionAlert, "re_al_user_id")
    declare public retention_alerts: RetentionAlert[];

    /* * Preparación para el nuevo módulo de facturación.
     * Un usuario (Asesor/Admin) puede generar múltiples planes de pago.
     */
    // @HasMany(() => PaymentPlan, 'pp_seller_id')
    // declare created_payment_plans: PaymentPlan[];
}

export default User;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - us_id
 *         - us_full_name
 *         - us_email
 *         - us_password_hash
 *         - us_role
 *       properties:
 *         us_id:
 *           type: string
 *           format: uuid
 *           description: Identificador único del usuario (Generado automáticamente)
 *         us_full_name:
 *           type: string
 *           description: Nombre completo del usuario
 *         us_email:
 *           type: string
 *           description: Correo electrónico del usuario (único)
 *         us_password_hash:
 *           type: string
 *           description: Hash de la contraseña del usuario
 *         us_role:
 *           type: string
 *           enum: [ADMIN, TEACHER]
 *           description: Rol del usuario dentro del sistema
 *         us_created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro
 *         us_updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la última actualización del registro
 */
