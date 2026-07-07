import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";
import type { StudentInClassProjection } from "@/app/class-track/core/students/domain/projections/StudentInClass.projection";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendance-session.repository";

export class GetActiveSessionsUseCase {
    public constructor(private readonly attendanceSessionRepository: AttendanceSessionRepository) {}

    public async executeInProgress(): Promise<StudentInClassProjection[]> {
        return this.attendanceSessionRepository.getActiveSessionsWithStudentDetails(attendanceSessionStatus.InProgress);
    }

    public async executePendingApproval(): Promise<StudentInClassProjection[]> {
        return this.attendanceSessionRepository.getActiveSessionsWithStudentDetails(attendanceSessionStatus.PendingApproval);
    }

    public async executeCompleted(): Promise<StudentInClassProjection[]> {
        return this.attendanceSessionRepository.getActiveSessionsWithStudentDetails(attendanceSessionStatus.Approved);
    }
}
