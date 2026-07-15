import cron from "node-cron";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/feats/attendance/infrastructure/datasource/attendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/feats/attendance/infrastructure/repositories/attendance-session.repository.impl";
import { CloseOrphanSessionsUseCase } from "@/app/class-track/feats/attendance/application/use-cases/close-orphan-sessions.use-case";
import { ColorsAdapter } from "@/core/utils/adapters/colors";

export class CloseOrphanSessionsWorker {
    public static start(): void {
        console.info(ColorsAdapter.setBlueBold("Initializing CloseOrphanSessionsWorker... (Schedule: 0 * * * *)"));

        cron.schedule("0 * * * *", () => {
            console.info(ColorsAdapter.setBlueBold(`[${new Date().toISOString()}] Executing CloseOrphanSessionsWorker...`));

            const datasource = new AttendanceSessionDatasourceImpl();
            const repository = new AttendanceSessionRepositoryImpl(datasource);
            const useCase = new CloseOrphanSessionsUseCase(repository);

            useCase
                .execute()
                .then((result) => {
                    console.info(ColorsAdapter.setGreen(`[CloseOrphanSessionsWorker] Orphan sessions closed: ${result}`));
                })
                .catch((error) => {
                    console.error(ColorsAdapter.setRedBold("[CloseOrphanSessionsWorker] Error executing worker:"));
                    console.error(error);
                });
        });
    }
}
