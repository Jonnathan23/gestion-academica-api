import type { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/attendance-session.entity";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";
import type { ApproveAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/approve-attendance-session.dto";

export class ApproveAttendanceSessionUseCase {
    public constructor(private readonly repository: AttendanceSessionRepository) {}

    public async execute(dto: ApproveAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        return this.repository.approveSession(dto);
    }
}
