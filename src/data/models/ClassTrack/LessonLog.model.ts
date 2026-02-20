import { Column, Table, DataType, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import AttendanceSession from "@/data/models/ClassTrack/AttendanceSession.model";


interface LessonLogAttributes {
    le_lo_id: string;
    le_lo_attendance_session_id: string;
    le_lo_lesson_number: string;
    le_lo_notes: string;
    le_lo_created_at: Date;
    le_lo_updated_at: Date;
}


@Table({
    tableName: "LessonLogs",
    timestamps: true,
    createdAt: 'le_lo_created_at',
    updatedAt: 'le_lo_updated_at'
})
class LessonLog extends Model<LessonLogAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4
    })
    declare le_lo_id: string;

    @ForeignKey(() => AttendanceSession)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare le_lo_attendance_session_id: string;

    @BelongsTo(() => AttendanceSession)
    declare attendance_session: AttendanceSession;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare le_lo_lesson_number: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare le_lo_notes: string;
}


export default LessonLog;
