import cron from "node-cron";
import { ColorsAdapter } from "@/core/utils";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/AttendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/AttendanceSession.repository.impl";
import { RetentionAlertDatasourceImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/datasource/RetentionAlert.datasource.impl";
import { RetentionAlertRepositoryImpl } from "@/app/class-track/feats/retention-alerts/infrastructure/repositories/RetentionAlert.repository.impl";
import { CalculateRetentionAlertsUseCase } from "@/app/class-track/feats/retention-alerts/application/use-cases/CalculateRetentionAlerts.use-case";

export class CalculateRetentionAlertsWorker {
    public static start(): void {
        console.info(ColorsAdapter.setBlueBold("Initializing CalculateRetentionAlertsWorker... (Schedule: 30 7 * * *)"));

        cron.schedule("30 7 * * *", () => {
            console.info(ColorsAdapter.setBlueBold(`[${new Date().toISOString()}] Executing CalculateRetentionAlertsWorker...`));

            const attendanceDatasource = new AttendanceSessionDatasourceImpl();
            const attendanceRepository = new AttendanceSessionRepositoryImpl(attendanceDatasource);

            const retentionDatasource = new RetentionAlertDatasourceImpl();
            const retentionRepository = new RetentionAlertRepositoryImpl(retentionDatasource);

            const useCase = new CalculateRetentionAlertsUseCase(attendanceRepository, retentionRepository);

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
