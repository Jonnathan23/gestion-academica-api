import type { StartAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/StartAttendanceSession.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/EndAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/AttendanceSession.entity";
import type { AbsentStudentProjection } from "@/app/class-track/feats/attendance/domain/projections/AbsentStudent.projection";
import type { GetActiveSessionsDto } from "@/app/class-track/feats/attendance/domain/dtos/GetActiveSessions.dto";
import type { StudentInClassProjection } from "@/app/class-track/feats/dashboard/domain/projections/StudentInClass.projection";

export abstract class AttendanceSessionDatasource {
    public abstract closeOrphanSessions(): Promise<number>;
    public abstract startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity>;
    public abstract endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity>;
    public abstract getStudentsAbsentForMoreThan(days: number): Promise<AbsentStudentProjection[]>;
    public abstract getActiveSessionsWithStudentDetails(dto: GetActiveSessionsDto): Promise<StudentInClassProjection[]>;
}
