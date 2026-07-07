import { Sequelize } from "sequelize-typescript";
import PaymentQuota from "@/data/models/admin-desk/payment-quota.model";
import PaymentPlan from "@/data/models/admin-desk/payment-plan.model";
import { CustomPostgresDatabaseConnectionError } from "../errors/custom-postgres-database-error.error";
import { ColorsAdapter } from "@/core/utils/adapters/colors";
import User from "@/data/models/shared/user.model";
import Student from "@/data/models/admin-desk/student.model";
import Module from "@/data/models/admin-desk/module.model";
import StudentModule from "@/data/models/admin-desk/student-module.model";
import AttendanceSession from "@/data/models/class-track/attendance-session.model";
import LessonLog from "@/data/models/class-track/lesson-log.model";
import RetentionAlert from "@/data/models/class-track/retention-alert.model";

interface DatabaseConnectionOptions {
    databaseUrl: string;
    enableLogging?: boolean;
    forceSynchronization?: boolean;
}

export class DatabaseConnection {
    private readonly sequelizeInstance: Sequelize;
    private readonly forceSynchronization: boolean;

    public constructor(options: DatabaseConnectionOptions) {
        const { databaseUrl, enableLogging = false, forceSynchronization = false } = options;

        this.sequelizeInstance = new Sequelize(databaseUrl, {
            models: [User, Student, Module, StudentModule, PaymentPlan, PaymentQuota, AttendanceSession, RetentionAlert, LessonLog],
            logging: enableLogging,
        });

        this.forceSynchronization = forceSynchronization;
    }

    public async connect(): Promise<void> {
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

    public async disconnect(): Promise<void> {
        await this.sequelizeInstance.close();
    }

    public getConnection(): Sequelize {
        return this.sequelizeInstance;
    }
}
