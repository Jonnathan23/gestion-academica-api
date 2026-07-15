import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendance-session.repository";
import { DashboardSummaryProjection } from "@/app/class-track/feats/dashboard/domain/projections/Dashboard.projection";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";
import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retention-alert.repository";
import { GetCountAlertsDto } from "@/app/class-track/feats/retention-alerts/application/dtos/get-count-alerts.dto";
import { retentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";
import { retentionAlertsValidators } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/di-validators";

export class GetDashboardSummaryUseCase {
    public constructor(
        private readonly attendanceRepository: AttendanceSessionRepository,
        private readonly retentionAlertRepository: RetentionAlertRepository,
        private readonly studentRepository: StudentClassTrackRepository,
    ) {}

    public async execute(): Promise<DashboardSummaryProjection> {
        const getCountPendingAlertsDto = GetCountAlertsDto.create(
            { status: retentionAlertStatus.Pending },
            retentionAlertsValidators.getCountAlertsValidator,
        );
        const getCountInProgressAlertsDto = GetCountAlertsDto.create(
            { status: retentionAlertStatus.InProgress },
            retentionAlertsValidators.getCountAlertsValidator,
        );

        const [studentsInClass, pendingCheckouts, pendingAlertsCount, inProgressAlertsCount, activeContractsCount] = await Promise.all([
            this.attendanceRepository.getActiveSessionsWithStudentDetails(attendanceSessionStatus.InProgress),
            this.attendanceRepository.getActiveSessionsWithStudentDetails(attendanceSessionStatus.PendingApproval),
            this.retentionAlertRepository.getCountAlerts(getCountPendingAlertsDto),
            this.retentionAlertRepository.getCountAlerts(getCountInProgressAlertsDto),
            this.studentRepository.getActiveContractsCount(),
        ]);

        const studentsInsideCount = studentsInClass.length;
        const pendingCheckoutsCount = pendingCheckouts.length;

        const activeAlertsCount = pendingAlertsCount + inProgressAlertsCount;

        return new DashboardSummaryProjection(
            studentsInsideCount,
            pendingCheckoutsCount,
            activeAlertsCount,
            activeContractsCount,
            studentsInClass,
        );
    }
}
