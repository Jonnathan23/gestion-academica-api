import { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";
import type { EndAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/end-attendance-session.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/attendance-session.entity";

export class EndAttendanceSessionUseCase {
    public constructor(private readonly attendanceSessionRepository: AttendanceSessionRepository) {}

    public async execute(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        return await this.attendanceSessionRepository.endSession(dto);
    }
}
