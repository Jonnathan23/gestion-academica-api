import { Column, Table, DataType, Model, HasMany } from "sequelize-typescript";
import StudentModule from "@/data/models/admin-desk/StudentModule.model";
import type { Optional } from "sequelize";

interface ModuleAttributes {
    mo_id: string;
    mo_name: string;
    mo_description: string;
    mo_level: number;
    mo_created_at: Date;
    mo_updated_at: Date;
}

interface ModuleCreationAttributes extends Optional<ModuleAttributes, "mo_id" | "mo_created_at" | "mo_updated_at"> {}

@Table({
    tableName: "Modules",
    timestamps: true,
    createdAt: "mo_created_at",
    updatedAt: "mo_updated_at",
})
class Module extends Model<ModuleAttributes, ModuleCreationAttributes> {
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    declare public mo_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare public mo_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare public mo_description: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: true,
    })
    declare public mo_level: number;

    @HasMany(() => StudentModule)
    declare public student_modules: StudentModule[];
}

export default Module;

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required:
 *         - mo_id
 *         - mo_name
 *         - mo_description
 *       properties:
 *         mo_id:
 *           type: string
 *           format: uuid
 *           description: Identificador único del módulo (Generado automáticamente)
 *         mo_name:
 *           type: string
 *           description: Nombre del módulo (único)
 *         mo_description:
 *           type: string
 *           description: Descripción del contenido o propósito del módulo
 *         mo_created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación del registro
 *         mo_updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la última actualización del registro
 */
