import { AttendanceSessionRepository } from "@/app/class-track/attendance/domain/repositories/AttendanceSession.repository";
import { AttendanceSessionDatasource } from "@/app/class-track/attendance/domain/datasource/AttendanceSession.datasource";
import type { StartAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/StartAttendanceSession.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/EndAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/attendance/domain/entities/AttendanceSession.entity";

export class AttendanceSessionRepositoryImpl implements AttendanceSessionRepository {
    constructor(private readonly datasource: AttendanceSessionDatasource) {}

    public async startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        return this.datasource.startSession(dto);
    }

    public async endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        return this.datasource.endSession(dto);
    }

    public async getStudentsAbsentForMoreThan(days: number): Promise<{ studentId: string; daysAbsent: number }[]> {
        return this.datasource.getStudentsAbsentForMoreThan(days);
    }

    public async closeOrphanSessions(): Promise<number> {
        return this.datasource.closeOrphanSessions();
    }
}
