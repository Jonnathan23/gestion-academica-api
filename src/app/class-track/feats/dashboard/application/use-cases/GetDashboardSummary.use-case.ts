import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/AttendanceSession.repository";
import type { StudentProjectionRepository } from "@/app/class-track/feats/attendance/domain/repositories/StudentProjection.repository";
import { DashboardSummaryProjection } from "@/app/class-track/feats/dashboard/domain/projections/Dashboard.projection";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";

export class GetDashboardSummaryUseCase {
    constructor(
        private readonly attendanceRepository: AttendanceSessionRepository,
        private readonly studentRepository: StudentProjectionRepository,
    ) {}

    public async execute(): Promise<DashboardSummaryProjection> {
        const [studentsInClass, pendingCheckouts, activeAlerts, activeContractsCount] = await Promise.all([
            this.attendanceRepository.getActiveSessionsWithStudentDetails(attendanceSessionStatus.InProgress),
            this.attendanceRepository.getActiveSessionsWithStudentDetails(attendanceSessionStatus.PendingApproval),
            this.attendanceRepository.getStudentsAbsentForMoreThan(3),
            this.studentRepository.getActiveContractsCount(),
        ]);

        const studentsInsideCount = studentsInClass.length;
        const pendingCheckoutsCount = pendingCheckouts.length;
        const activeAlertsCount = activeAlerts.length;

        return new DashboardSummaryProjection(
            studentsInsideCount,
            pendingCheckoutsCount,
            activeAlertsCount,
            activeContractsCount,
            studentsInClass,
        );
    }
}
