import { Sequelize } from "sequelize-typescript";
import { ColorsAdapter } from "@/core/utils";


interface Options {
    ulrDatabase: string
    logging?: boolean
}

export class DatabaseConnection {
    private readonly db: Sequelize;

    constructor({ ulrDatabase, logging = false }: Options) {

        const db = new Sequelize(ulrDatabase, {
            models: [__dirname + '/models/**/*'],
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