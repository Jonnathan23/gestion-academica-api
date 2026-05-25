import { AttendanceSessionRepository } from "@/app/class-track/attendance/domain/repositories/AttendanceSession.repository";
import type { EndAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/EndAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/attendance/domain/entities/AttendanceSession.entity";

export class EndAttendanceSessionUseCase {
    constructor(private readonly attendanceSessionRepository: AttendanceSessionRepository) {}

    public async execute(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        return await this.attendanceSessionRepository.endSession(dto);
    }
}
