import type { Optional } from "sequelize";
import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import AttendanceSession from "@/data/models/class-track/AttendanceSession.model";

interface LessonLogAttributes {
    le_lo_id: string;
    le_lo_attendance_session_id: string;
    le_lo_lesson_number: string;
    le_lo_notes: string;
    le_lo_created_at: Date;
    le_lo_updated_at: Date;
}
interface LessonLogCreationAttributes extends Optional<LessonLogAttributes, "le_lo_id" | "le_lo_created_at" | "le_lo_updated_at"> {}
@Table({
    tableName: "LessonLogs",
    timestamps: true,
    createdAt: "le_lo_created_at",
    updatedAt: "le_lo_updated_at",
})
class LessonLog extends Model<LessonLogAttributes, LessonLogCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    declare le_lo_id: string;

    @ForeignKey(() => AttendanceSession)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare le_lo_attendance_session_id: string;

    @BelongsTo(() => AttendanceSession)
    declare attendance_session: AttendanceSession;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare le_lo_lesson_number: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare le_lo_notes: string;
}

export default LessonLog;

/**
 * @swagger
 * components:
 *   schemas:
 *     LessonLog:
 *       type: object
 *       required:
 *         - le_lo_id
 *         - le_lo_attendance_session_id
 *         - le_lo_lesson_number
 *         - le_lo_notes
 *       properties:
 *         le_lo_id:
 *           type: string
 *           format: uuid
 *           description: Identificador único del registro de lección (Generado automáticamente)
 *         le_lo_attendance_session_id:
 *           type: string
 *           format: uuid
 *           description: ID de la sesión de asistencia a la que pertenece este registro (FK → AttendanceSessions)
 *         le_lo_lesson_number:
 *           type: string
 *           description: Número o identificador de la lección impartida durante la sesión
 *         le_lo_notes:
 *           type: string
 *           description: Observaciones y notas del docente sobre el desarrollo de la lección
 *         le_lo_created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro
 *         le_lo_updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la última actualización del registro
 */
