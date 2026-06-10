import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/Attendance.interface";
import type { StudentInClassProjection } from "@/app/class-track/core/students/domain/projections/StudentInClass.projection";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";

export class GetActiveSessionsUseCase {
    constructor(private readonly attendanceSessionRepository: AttendanceSessionRepository) {}

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
