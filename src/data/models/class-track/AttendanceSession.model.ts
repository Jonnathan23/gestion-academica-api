import type { Optional } from "sequelize";
import { Column, Table, DataType, Model, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import Student from "@/data/models/admin-desk/Student.model";
import User from "@/data/models/shared/User.model";
import LessonLog from "@/data/models/class-track/LessonLog.model";

const attendanceSessionStatus = {
    InProgress: "IN_PROGRESS",
    PendingApproval: "PENDING_APPROVAL",
    Approved: "APPROVED",
} as const;

export type AttendanceSessionStatus = (typeof attendanceSessionStatus)[keyof typeof attendanceSessionStatus];

interface AttendanceSessionAttributes {
    at_se_id: string;
    at_se_student_id: string;
    at_se_teacher_id: string | null;
    at_se_session_date: Date;
    at_se_entry_time: Date;
    at_se_exit_time: Date | null;
    at_se_total_minutes: number | null;
    at_se_status: AttendanceSessionStatus;
    at_se_created_at: Date;
    at_se_updated_at: Date;
}

interface AttendanceSessionCreationAttributes extends Optional<
    AttendanceSessionAttributes,
    "at_se_id" | "at_se_teacher_id" | "at_se_exit_time" | "at_se_total_minutes" | "at_se_status" | "at_se_created_at" | "at_se_updated_at"
> {}

@Table({
    tableName: "AttendanceSessions",
    timestamps: true,
    createdAt: "at_se_created_at",
    updatedAt: "at_se_updated_at",
})
class AttendanceSession extends Model<AttendanceSessionAttributes, AttendanceSessionCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    declare at_se_id: string;

    @ForeignKey(() => Student)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare at_se_student_id: string;

    @BelongsTo(() => Student)
    declare student: Student;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare at_se_teacher_id: string;

    @BelongsTo(() => User)
    declare teacher: User;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    declare at_se_session_date: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare at_se_entry_time: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare at_se_exit_time: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare at_se_total_minutes: number;

    @Column({
        type: DataType.ENUM(...Object.values(attendanceSessionStatus)),
        allowNull: false,
        defaultValue: attendanceSessionStatus.InProgress,
    })
    declare at_se_status: AttendanceSessionStatus;

    @HasOne(() => LessonLog)
    declare lesson_log: LessonLog;
}

export default AttendanceSession;

/**
 * @swagger
 * components:
 *   schemas:
 *     AttendanceSession:
 *       type: object
 *       required:
 *         - at_se_id
 *         - at_se_student_id
 *         - at_se_session_date
 *         - at_se_entry_time
 *         - at_se_status
 *       properties:
 *         at_se_id:
 *           type: string
 *           format: uuid
 *           description: Identificador único de la sesión de asistencia (Generado automáticamente)
 *         at_se_student_id:
 *           type: string
 *           format: uuid
 *           description: ID del estudiante al que pertenece la sesión (FK → Students)
 *         at_se_teacher_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID del docente que supervisó la sesión (FK → Users, opcional)
 *         at_se_session_date:
 *           type: string
 *           format: date-time
 *           description: Fecha en que se registró la sesión de asistencia
 *         at_se_entry_time:
 *           type: string
 *           format: date-time
 *           description: Hora de entrada del estudiante a la sesión
 *         at_se_exit_time:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Hora de salida del estudiante de la sesión (nulo si aún está en curso)
 *         at_se_total_minutes:
 *           type: integer
 *           nullable: true
 *           description: Total de minutos que duró la sesión (calculado al cerrar)
 *         at_se_status:
 *           type: string
 *           enum: [IN_PROGRESS, PENDING_APPROVAL, APPROVED]
 *           description: Estado actual de la sesión de asistencia
 *         at_se_created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro
 *         at_se_updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la última actualización del registro
 */
