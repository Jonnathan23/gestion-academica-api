import { Column, Table, DataType, Model, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import Student from "@/data/models/AdminDesk/Student.model";
import User from "@/data/models/Shared/User.model";
import LessonLog from "@/data/models/ClassTrack/LessonLog.model";


const attendanceSessionStatus = {
    IN_PROGRESS: "IN_PROGRESS",
    PENDING_APPROVAL: "PENDING_APPROVAL",
    APPROVED: "APPROVED"
} as const

export type AttendanceSessionStatus = typeof attendanceSessionStatus[keyof typeof attendanceSessionStatus]

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


@Table({
    tableName: "AttendanceSessions",
    timestamps: true,
    createdAt: 'at_se_created_at',
    updatedAt: 'at_se_updated_at'
})
class AttendanceSession extends Model<AttendanceSessionAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4
    })
    declare at_se_id: string;

    @ForeignKey(() => Student)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare at_se_student_id: string;

    @BelongsTo(() => Student)
    declare student: Student;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    declare at_se_teacher_id: string;

    @BelongsTo(() => User)
    declare teacher: User;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare at_se_session_date: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare at_se_entry_time: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare at_se_exit_time: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare at_se_total_minutes: number;

    @Column({
        type: DataType.ENUM(...Object.values(attendanceSessionStatus)),
        allowNull: false,
        defaultValue: attendanceSessionStatus.IN_PROGRESS
    })
    declare at_se_status: AttendanceSessionStatus;

    @HasOne(() => LessonLog)
    declare lesson_log: LessonLog;
}


export default AttendanceSession;
