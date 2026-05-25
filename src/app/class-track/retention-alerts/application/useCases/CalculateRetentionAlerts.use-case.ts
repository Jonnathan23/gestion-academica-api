import type { AttendanceSessionRepository } from "@/app/class-track/attendance/domain/repositories/AttendanceSession.repository";
import type { RetentionAlertRepository } from "@/app/class-track/retention-alerts/domain/repositories/RetentionAlert.repository";
import { CustomError } from "@/core/error/customError.error";

export class CalculateRetentionAlertsUseCase {
    constructor(
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
        private readonly retentionAlertRepository: RetentionAlertRepository,
    ) {}

    public async execute(): Promise<number> {
        try {
            const absentStudents = await this.attendanceSessionRepository.getStudentsAbsentForMoreThan(3);

            for (const student of absentStudents) {
                await this.retentionAlertRepository.upsertAlert(student.studentId, student.daysAbsent);
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
