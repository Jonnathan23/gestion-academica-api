import { Op } from "sequelize";
import AttendanceSession from "@/data/models/ClassTrack/AttendanceSession.model";
import { CustomError } from "@/core/error/customError.error";
import { AttendanceSessionDatasource } from "@/app/class-track/attendance/domain/datasource/AttendanceSession.datasource";

export class AttendanceSessionDatasourceImpl implements AttendanceSessionDatasource {
    public async closeOrphanSessions(): Promise<number> {
        const transaction = await AttendanceSession.sequelize?.transaction();

        if (!transaction) {
            throw CustomError.internalServer("Error initializing database transaction");
        }

        try {
            const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

            const orphanSessions = await AttendanceSession.findAll({
                where: {
                    at_se_status: "IN_PROGRESS",
                    at_se_entry_time: {
                        [Op.lt]: twelveHoursAgo,
                    },
                },
                transaction,
            });

            let updatedCount = 0;

            for (const session of orphanSessions) {
                const exitTime = new Date(session.at_se_entry_time.getTime() + 12 * 60 * 60 * 1000);

                await session.update(
                    {
                        at_se_exit_time: exitTime,
                        at_se_total_minutes: 720,
                        at_se_status: "APPROVED",
                    },
                    { transaction },
                );

                updatedCount++;
            }

            await transaction.commit();
            return updatedCount;
        } catch (error) {
            await transaction.rollback();
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer("Error closing orphan sessions");
        }
    }
}
