import { Column, Table, DataType, Model, HasMany } from "sequelize-typescript";
import AttendanceSession from "@/data/models/ClassTrack/AttendanceSession.model";
import RetentionAlert from "@/data/models/ClassTrack/RetentionAlert.model";
import StudentModule from "@/data/models/AdminDesk/StudentModule.model";




const studentContractStatus = {
    ACTIVE: "ACTIVE",
    FROZEN: "FROZEN",
    INACTIVE: "INACTIVE"
} as const

export type StudentContractStatus = typeof studentContractStatus[keyof typeof studentContractStatus]

const studentProgressCategory = {
    FAST: "FAST",
    MODERATE: "MODERATE",
    SLOW: "SLOW",
    NOT_ENOUGH_DATA: "NOT_ENOUGH_DATA"
} as const

export type StudentProgressCategory = typeof studentProgressCategory[keyof typeof studentProgressCategory]

interface StudentAttributes {
    st_id: string;
    st_identification_card: string;
    st_full_name: string;
    st_phone_number: string;
    st_start_date: Date;
    st_is_graduated: boolean;
    st_contract_status: StudentContractStatus;
    st_progress_category: StudentProgressCategory;
    st_created_at: Date;
    st_updated_at: Date;
}


@Table({
    tableName: "Students",
    timestamps: true,
    createdAt: 'st_created_at',
    updatedAt: 'st_updated_at'
})
class Student extends Model<StudentAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4
    })
    declare st_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare st_identification_card: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare st_full_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare st_phone_number: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare st_start_date: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare st_is_graduated: boolean;

    @Column({
        type: DataType.ENUM(...Object.values(studentContractStatus)),
        allowNull: false
    })
    declare st_contract_status: StudentContractStatus;

    @Column({
        type: DataType.ENUM(...Object.values(studentProgressCategory)),
        allowNull: false
    })
    declare st_progress_category: StudentProgressCategory;

    @HasMany(() => StudentModule)
    declare student_modules: StudentModule[];

    @HasMany(() => AttendanceSession)
    declare attendance_sessions: AttendanceSession[];

    @HasMany(() => RetentionAlert)
    declare retention_alerts: RetentionAlert[];
}


export default Student;
