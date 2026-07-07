import type { Optional } from "sequelize";
import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import AttendanceSession from "@/data/models/class-track/AttendanceSession.model";

interface LessonLogAttributes {
    le_lo_id: string;
    le_lo_attendance_session_id: string;
    le_lo_lesson_number: number;
    le_lo_oral_practice_score: number | null;
    le_lo_is_completed: boolean;
    le_lo_created_at: Date;
    le_lo_updated_at: Date;
}

// Hacemos opcionales los campos que la DB autogenera, que aceptan nulos, o que tienen valores por defecto
interface LessonLogCreationAttributes extends Optional<
    LessonLogAttributes,
    "le_lo_id" | "le_lo_oral_practice_score" | "le_lo_is_completed" | "le_lo_created_at" | "le_lo_updated_at"
> {}

const MAX_DECIMAL_ORAL_PRACTICE: number = 5;
const PRECISION_DECIMAL_ORAL_PRACTICE: number = 2;

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
    declare public le_lo_id: string;

    @ForeignKey(() => AttendanceSession)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare public le_lo_attendance_session_id: string;

    @BelongsTo(() => AttendanceSession)
    declare public attendance_session: AttendanceSession;

    /**
     * Número de la lección impartida.
     * Cambiado a INTEGER para permitir cálculos de avance.
     */
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare public le_lo_lesson_number: number;

    /**
     * Puntuación del oral practice.
     * DECIMAL(5,2) permite valores como 100.00 o 95.50.
     * Es nulo si la lección aún no se ha evaluado.
     */
    @Column({
        type: DataType.DECIMAL(MAX_DECIMAL_ORAL_PRACTICE, PRECISION_DECIMAL_ORAL_PRACTICE),
        allowNull: true,
    })
    declare public le_lo_oral_practice_score: number;

    /**
     * Bandera para identificar rápidamente si la lección fue superada.
     */
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare public le_lo_is_completed: boolean;
}

export default LessonLog;

/**
 * @swagger
 * components:
 * schemas:
 * LessonLog:
 * type: object
 * required:
 * - le_lo_id
 * - le_lo_attendance_session_id
 * - le_lo_lesson_number
 * properties:
 * le_lo_id:
 * type: string
 * format: uuid
 * description: Identificador único del registro de lección (Generado automáticamente)
 * le_lo_attendance_session_id:
 * type: string
 * format: uuid
 * description: ID de la sesión de asistencia a la que pertenece este registro (FK → AttendanceSessions)
 * le_lo_lesson_number:
 * type: integer
 * description: Número absoluto de la lección impartida durante la sesión (Ej. 14, 15, 16)
 * le_lo_oral_practice_score:
 * type: number
 * format: float
 * description: Puntuación obtenida en la práctica oral (nulo si la lección sigue en progreso)
 * le_lo_is_completed:
 * type: boolean
 * description: Indica si el estudiante aprobó el oral practice y completó la lección
 * le_lo_created_at:
 * type: string
 * format: date-time
 * description: Fecha y hora de creación del registro
 * le_lo_updated_at:
 * type: string
 * format: date-time
 * description: Fecha y hora de la última actualización del registro
 */
