import { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/AttendanceSession.repository";
import { AttendanceSessionDatasource } from "@/app/class-track/feats/attendance/domain/datasource/AttendanceSession.datasource";
import type { StartAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/StartAttendanceSession.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/EndAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/AttendanceSession.entity";
import type { AbsentStudentProjection } from "@/app/class-track/feats/attendance/domain/projections/AbsentStudent.projection";
import type { StudentInClassProjection } from "@/app/class-track/feats/dashboard/domain/projections/StudentInClass.projection";

export class AttendanceSessionRepositoryImpl implements AttendanceSessionRepository {
    constructor(private readonly datasource: AttendanceSessionDatasource) {}

    public async startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        return this.datasource.startSession(dto);
    }

    public async endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        return this.datasource.endSession(dto);
    }

    public async getStudentsAbsentForMoreThan(days: number): Promise<AbsentStudentProjection[]> {
        return this.datasource.getStudentsAbsentForMoreThan(days);
    }

    public async closeOrphanSessions(): Promise<number> {
        return this.datasource.closeOrphanSessions();
    }

    public async getActiveSessionsWithStudentDetails(status: AttendanceSessionStatus): Promise<StudentInClassProjection[]> {
        return this.datasource.getActiveSessionsWithStudentDetails(status);
    }
}
