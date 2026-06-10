import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";
import { DashboardSummaryProjection } from "@/app/class-track/feats/dashboard/domain/projections/Dashboard.projection";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/Attendance.interface";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";

export class GetDashboardSummaryUseCase {
    constructor(
        private readonly attendanceRepository: AttendanceSessionRepository,
        private readonly studentRepository: StudentClassTrackRepository,
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
