import { Column, Table, DataType, Model, HasMany } from "sequelize-typescript";
import AttendanceSession from "@/data/models/ClassTrack/AttendanceSession.model";
import RetentionAlert from "@/data/models/ClassTrack/RetentionAlert.model";
import StudentModule from "@/data/models/AdminDesk/StudentModule.model";
// import PaymentPlan from './PaymentPlan.model'; // Descomentaremos esto cuando creemos la tabla

export const studentContractStatus = {
    Active: "ACTIVE",
    Frozen: "FROZEN",
    Inactive: "INACTIVE",
} as const;

export type StudentContractStatus = (typeof studentContractStatus)[keyof typeof studentContractStatus];

export const studentProgressCategory = {
    Fast: "FAST",
    Moderate: "MODERATE",
    Slow: "SLOW",
    NotEnoughData: "NOT_ENOUGH_DATA",
} as const;

export type StudentProgressCategory = (typeof studentProgressCategory)[keyof typeof studentProgressCategory];

export const certificateType = {
    OneTonne: "ONE_TONNE",
    Toefl: "TOEFL",
    Other: "OTHER",
} as const;

export type CertificateType = (typeof certificateType)[keyof typeof certificateType];

interface StudentAttributes {
    st_id: string;
    st_identification_card: string;
    st_full_name: string;
    st_phone_number: string;
    st_email: string;
    st_date_of_birth: Date;
    st_nationality: string;
    st_certificate_type: CertificateType;
    st_start_date: Date;
    st_is_graduated: boolean;
    st_contract_status: StudentContractStatus;
    st_progress_category: StudentProgressCategory;
    st_created_at: Date;
    st_updated_at: Date;
}

interface StudentCreationAttributes extends Omit<StudentAttributes, "st_id" | "st_created_at" | "st_updated_at"> {}

@Table({
    tableName: "Students",
    timestamps: true,
    createdAt: "st_created_at",
    updatedAt: "st_updated_at",
})
class Student extends Model<StudentAttributes, StudentCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    declare st_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare st_identification_card: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare st_full_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare st_phone_number: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare st_email: string;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    declare st_date_of_birth: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare st_nationality: string;

    @Column({
        type: DataType.ENUM(...Object.values(certificateType)),
        allowNull: false,
    })
    declare st_certificate_type: CertificateType;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    declare st_start_date: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare st_is_graduated: boolean;

    @Column({
        type: DataType.ENUM(...Object.values(studentContractStatus)),
        allowNull: false,
    })
    declare st_contract_status: StudentContractStatus;

    @Column({
        type: DataType.ENUM(...Object.values(studentProgressCategory)),
        allowNull: false,
    })
    declare st_progress_category: StudentProgressCategory;

    //* Relaciones (Has Many)

    @HasMany(() => StudentModule)
    declare student_modules: StudentModule[];

    @HasMany(() => AttendanceSession)
    declare attendance_sessions: AttendanceSession[];

    @HasMany(() => RetentionAlert)
    declare retention_alerts: RetentionAlert[];

    /* * Preparación para el nuevo módulo de facturación.
     * Un estudiante puede tener múltiples planes de pago a lo largo de su vida académica.
     */
    // @HasMany(() => PaymentPlan, 'pp_student_id')
    // declare payment_plans: PaymentPlan[];
}

export default Student;

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - st_id
 *         - st_identification_card
 *         - st_full_name
 *         - st_phone_number
 *         - st_start_date
 *         - st_is_graduated
 *         - st_contract_status
 *         - st_progress_category
 *       properties:
 *         st_id:
 *           type: string
 *           format: uuid
 *           description: Identificador único del estudiante (Generado automáticamente)
 *         st_identification_card:
 *           type: string
 *           description: Cédula de identidad del estudiante (única)
 *         st_full_name:
 *           type: string
 *           description: Nombre completo del estudiante
 *         st_phone_number:
 *           type: string
 *           description: Número de teléfono de contacto del estudiante
 *         st_start_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio del contrato o inscripción del estudiante
 *         st_is_graduated:
 *           type: boolean
 *           description: Indica si el estudiante ha completado y graduado el programa
 *         st_contract_status:
 *           type: string
 *           enum: [ACTIVE, FROZEN, INACTIVE]
 *           description: Estado actual del contrato del estudiante
 *         st_progress_category:
 *           type: string
 *           enum: [FAST, MODERATE, SLOW, NOT_ENOUGH_DATA]
 *           description: Categoría de progreso académico del estudiante
 *         st_created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro
 *         st_updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la última actualización del registro
 */
