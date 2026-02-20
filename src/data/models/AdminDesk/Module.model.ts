import { Column, Table, DataType, Model, HasMany } from "sequelize-typescript";
import StudentModule from "@/data/models/AdminDesk/StudentModule.model";


interface ModuleAttributes {
    mo_id: string;
    mo_name: string;
    mo_description: string;
    mo_created_at: Date;
    mo_updated_at: Date;
}


@Table({
    tableName: "Modules",
    timestamps: true,
    createdAt: 'mo_created_at',
    updatedAt: 'mo_updated_at'
})
class Module extends Model<ModuleAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4
    })
    declare mo_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare mo_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare mo_description: string;

    @HasMany(() => StudentModule)
    declare student_modules: StudentModule[];
}


export default Module;
