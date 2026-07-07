import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendance-session.repository";
import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retention-alert.repository";
import { CustomError } from "@/core/error/customError.error";

export class CalculateRetentionAlertsUseCase {
    private readonly thresholdDays: number;
    private readonly defaultDays: number = 10;

    public constructor(
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
        private readonly retentionAlertRepository: RetentionAlertRepository,
        thresholdDays?: number,
    ) {
        this.thresholdDays = thresholdDays ?? this.defaultDays;
    }

    public async execute(): Promise<number> {
        try {
            const absentStudents = await this.attendanceSessionRepository.getStudentsAbsentForMoreThan(this.thresholdDays);

            for (const student of absentStudents) {
                await this.retentionAlertRepository.upsertAlert(student.student.id, student.daysAbsent);
            }

            return absentStudents.length;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer("Error calculating retention alerts");
        }
    }
}
