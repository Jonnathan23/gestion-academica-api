import { Column, Table, DataType, Model, HasMany } from "sequelize-typescript";
import StudentModule from "@/data/models/AdminDesk/StudentModule.model";
import AttendanceSession from "@/data/models/ClassTrack/AttendanceSession.model";
import RetentionAlert from "@/data/models/ClassTrack/RetentionAlert.model";


const userRoles = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER"
} as const

export type UserRoles = typeof userRoles[keyof typeof userRoles]

interface UserAttributes {
    us_id: string;
    us_full_name: string;
    us_email: string;
    us_password_hash: string;
    us_role: UserRoles;
    us_created_at: Date;
    us_updated_at: Date;
}


@Table({
    tableName: "Users",
    timestamps: true,
    createdAt: 'us_created_at',
    updatedAt: 'us_updated_at'
})
class User extends Model<UserAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4
    })
    declare us_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare us_full_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare us_email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare us_password_hash: string;

    @Column({
        type: DataType.ENUM(...Object.values(userRoles)),
        allowNull: false
    })
    declare us_role: UserRoles;

    @HasMany(() => StudentModule, 'st_mod_seller_id')
    declare sold_modules: StudentModule[];

    @HasMany(() => AttendanceSession, 'at_se_teacher_id')
    declare overseen_sessions: AttendanceSession[];

    @HasMany(() => RetentionAlert, 're_al_user_id')
    declare retention_alerts: RetentionAlert[];
}


export default User;