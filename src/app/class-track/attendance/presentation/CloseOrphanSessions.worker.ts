import cron from "node-cron";
import { ColorsAdapter } from "@/core/utils";
import { AttendanceSessionDatasourceImpl } from "@/app/class-track/attendance/infrastructure/datasource/AttendanceSession.datasource.impl";
import { AttendanceSessionRepositoryImpl } from "@/app/class-track/attendance/infrastructure/repositories/AttendanceSession.repository.impl";
import { CloseOrphanSessionsUseCase } from "@/app/class-track/attendance/application/useCases/CloseOrphanSessions.use-case";

export class CloseOrphanSessionsWorker {
    public static start(): void {
        console.info(ColorsAdapter.setBlueBold("Initializing CloseOrphanSessionsWorker... (Schedule: 0 * * * *)"));

        cron.schedule("0 * * * *", async () => {
            console.info(ColorsAdapter.setBlueBold(`[${new Date().toISOString()}] Executing CloseOrphanSessionsWorker...`));

            const datasource = new AttendanceSessionDatasourceImpl();
            const repository = new AttendanceSessionRepositoryImpl(datasource);
            const useCase = new CloseOrphanSessionsUseCase(repository);

            try {
                const result = await useCase.execute();
                console.info(ColorsAdapter.setGreen(`[CloseOrphanSessionsWorker] Orphan sessions closed: ${result}`));
            } catch (error) {
                console.error(ColorsAdapter.setRedBold("[CloseOrphanSessionsWorker] Error executing worker:"));
                console.error(error);
            }
        });
    }
}
