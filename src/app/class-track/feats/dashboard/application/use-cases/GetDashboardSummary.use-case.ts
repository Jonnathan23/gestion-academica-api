import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/AttendanceSession.repository";
import type { StudentProjectionRepository } from "@/app/class-track/feats/attendance/domain/repositories/StudentProjection.repository";
import { DashboardSummaryProjection } from "@/app/class-track/feats/dashboard/domain/projections/Dashboard.projection";
import { GetActiveSessionsDto } from "@/app/class-track/feats/attendance/domain/dtos/GetActiveSessions.dto";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";

export class GetDashboardSummaryUseCase {
    constructor(
        private readonly attendanceRepository: AttendanceSessionRepository,
        private readonly studentRepository: StudentProjectionRepository,
    ) {}

    public async execute(): Promise<DashboardSummaryProjection> {
        const [inProgressError, inProgressDto] = GetActiveSessionsDto.create({
            statuses: [attendanceSessionStatus.InProgress],
        });

        if (inProgressError || !inProgressDto) {
            throw new Error(`Failed to create GetActiveSessionsDto for IN_PROGRESS: ${inProgressError}`);
        }

        const [pendingError, pendingDto] = GetActiveSessionsDto.create({
            statuses: [attendanceSessionStatus.PendingApproval],
        });

        if (pendingError || !pendingDto) {
            throw new Error(`Failed to create GetActiveSessionsDto for PENDING_APPROVAL: ${pendingError}`);
        }

        const [studentsInClass, pendingCheckouts, activeAlerts, activeContractsCount] = await Promise.all([
            this.attendanceRepository.getActiveSessionsWithStudentDetails(inProgressDto),
            this.attendanceRepository.getActiveSessionsWithStudentDetails(pendingDto),
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
