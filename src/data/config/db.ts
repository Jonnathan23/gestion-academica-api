import { Sequelize } from "sequelize-typescript";
import { ColorsAdapter } from "@/core/utils";
import User from "@/data/models/Shared/User.model";
import Student from "@/data/models/AdminDesk/Student.model";
import Module from "@/data/models/AdminDesk/Module.model";
import StudentModule from "@/data/models/AdminDesk/StudentModule.model";
import AttendanceSession from "@/data/models/ClassTrack/AttendanceSession.model";
import RetentionAlert from "@/data/models/ClassTrack/RetentionAlert.model";
import LessonLog from "@/data/models/ClassTrack/LessonLog.model";


interface Options {
    ulrDatabase: string
    logging?: boolean
}

export class DatabaseConnection {
    private readonly db: Sequelize;

    constructor({ ulrDatabase, logging = false }: Options) {

        const db = new Sequelize(ulrDatabase, {
            models: [
                User, //Shared
                Student, Module, StudentModule, //AdminDesk
                AttendanceSession, RetentionAlert, LessonLog //ClassTrack
            ],
            logging: logging
        })

        this.db = db
    }

    async connect(force: boolean = false) {
        console.log(ColorsAdapter.setYellow('Conectando a la BD...\n'))
        try {
            await this.db.authenticate()
            await this.db.sync({ force })
            console.log(ColorsAdapter.setBlueBold('Conexion exitosa a la BD'))
        } catch (error) {
            console.log(ColorsAdapter.setRedBold('Error al conectar a la BD'))
            console.log(error)
        }
    }

    async disconnect() {
        await this.db.close()
    }

    getConnection() {
        return this.db
    }

}