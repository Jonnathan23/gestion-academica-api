import { Op } from "sequelize";
import RetentionAlert from "@/data/models/ClassTrack/RetentionAlert.model";
import type { RetentionAlertDatasource } from "@/app/class-track/retention-alerts/domain/datasource/RetentionAlert.datasource";
import { retentionAlertStatus } from "@/app/class-track/retention-alerts/domain/interfaces/retention-alert.interface";

export class RetentionAlertDatasourceImpl implements RetentionAlertDatasource {
    public async upsertAlert(studentId: string, daysAbsent: number): Promise<void> {
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
                re_al_status: retentionAlertStatus.Pending,
                re_al_user_id: null, // Allow system to assign null initially
            });
        }
    }
}
