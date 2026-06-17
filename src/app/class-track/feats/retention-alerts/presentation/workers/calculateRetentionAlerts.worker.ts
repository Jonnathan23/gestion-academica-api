import cron from "node-cron";
import { ColorsAdapter } from "@/core/utils";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendanceSession.repository.impl";
import { RetentionAlertDatasourceImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/datasource/retentionAlert.datasource.impl";
import { RetentionAlertRepositoryImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/repositories/retentionAlert.repository.impl";
import { CalculateRetentionAlertsUseCase } from "@/app/class-track/feats/retention-alerts/application/use-cases/calculateRetentionAlerts.use-case";

export class CalculateRetentionAlertsWorker {
    private static readonly thresholdDays: number = 10;
    private static readonly cronExecutionTime: string = "30 7 * * *";

    public static start(): void {
        console.info(ColorsAdapter.setBlueBold(`Initializing CalculateRetentionAlertsWorker... (Schedule: ${this.cronExecutionTime})`));

        cron.schedule(this.cronExecutionTime, () => {
            console.info(ColorsAdapter.setBlueBold(`[${new Date().toISOString()}] Executing CalculateRetentionAlertsWorker...`));

            const attendanceDatasource = new AttendanceSessionDatasourceImpl();
            const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

            const retentionDatasource = new RetentionAlertDatasourceImpl();
            const retentionRepository = new RetentionAlertRepositoryImpl(retentionDatasource);

            const useCase = new CalculateRetentionAlertsUseCase(attendanceRepository, retentionRepository, this.thresholdDays);

            useCase
                .execute()
                .then((result) => {
                    console.info(ColorsAdapter.setGreen(`[CalculateRetentionAlertsWorker] Success: ${result} retention alerts processed.`));
                })
                .catch((error) => {
                    console.error(ColorsAdapter.setRedBold("[CalculateRetentionAlertsWorker] Error executing worker:"));
                    console.error(error);
                });
        });
    }
}
