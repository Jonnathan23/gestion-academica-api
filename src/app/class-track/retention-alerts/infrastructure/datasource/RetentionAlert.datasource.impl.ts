import { Op } from "sequelize";
import RetentionAlert from "@/data/models/ClassTrack/RetentionAlert.model";
import { CustomError } from "@/core/error/customError.error";
import type { RetentionAlertDatasource } from "@/app/class-track/retention-alerts/domain/datasource/RetentionAlert.datasource";

export class RetentionAlertDatasourceImpl implements RetentionAlertDatasource {
    public async upsertAlert(studentId: string, daysAbsent: number): Promise<void> {
        try {
            const existingAlert = await RetentionAlert.findOne({
                where: {
                    re_al_student_id: studentId,
                    re_al_status: {
                        [Op.in]: ["PENDING", "IN_PROGRESS"],
                    },
                },
            });

            if (existingAlert) {
                await existingAlert.update({
                    re_al_days_absent: daysAbsent,
                });
            } else {
                await RetentionAlert.create({
                    re_al_student_id: studentId,
                    re_al_contact_date: new Date(),
                    re_al_days_absent: daysAbsent,
                    re_al_observations: `Automated alert created for ${daysAbsent} days of absence.`,
                    re_al_status: "PENDING",
                    re_al_user_id: null, // Allow system to assign null initially
                });
            }
        } catch (error) {
            throw CustomError.internalServer("Error upserting retention alert");
        }
    }
}
