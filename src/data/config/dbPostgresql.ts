import { Sequelize } from "sequelize-typescript";

import { ColorsAdapter } from "@/core/utils";
import { User } from "@/data/models/shared";
import { Student, Module, StudentModule } from "@/data/models/admin-desk";
import { AttendanceSession, LessonLog, RetentionAlert } from "@/data/models/class-track";
import PaymentQuota from "@/data/models/admin-desk/PaymentQuota.model";
import PaymentPlan from "@/data/models/admin-desk/PaymentPlan.model";
import { CustomPostgresDatabaseConnectionError } from "../errors/CustomPostgresDatabaseError.error";

interface DatabaseConnectionOptions {
    databaseUrl: string;
    enableLogging?: boolean;
    forceSynchronization?: boolean;
}

export class DatabaseConnection {
    private readonly sequelizeInstance: Sequelize;
    private readonly forceSynchronization: boolean;

    constructor(options: DatabaseConnectionOptions) {
        const { databaseUrl, enableLogging = false, forceSynchronization = false } = options;

        this.sequelizeInstance = new Sequelize(databaseUrl, {
            models: [User, Student, Module, StudentModule, PaymentPlan, PaymentQuota, AttendanceSession, RetentionAlert, LessonLog],
            logging: enableLogging,
        });

        this.forceSynchronization = forceSynchronization;
    }

    async connect(): Promise<void> {
        console.info(ColorsAdapter.setYellow("Connecting to the database...\n"));
        try {
            await this.sequelizeInstance.authenticate();

            await this.sequelizeInstance.sync({ force: this.forceSynchronization });

            console.info(ColorsAdapter.setBlueBold("Successful connection to the database"));
        } catch (error) {
            console.error(ColorsAdapter.setRedBold("\n[FATAL] Error connecting to the database during startup:"));
            CustomPostgresDatabaseConnectionError.getErrorDetails(error);
        }
    }

    async disconnect(): Promise<void> {
        await this.sequelizeInstance.close();
    }

    getConnection(): Sequelize {
        return this.sequelizeInstance;
    }
}
