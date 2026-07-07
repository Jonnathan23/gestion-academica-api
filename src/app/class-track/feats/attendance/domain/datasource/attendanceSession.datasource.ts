import type { StartAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/start-attendance-session.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/end-attendance-session.dto";
import type { ApproveAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/approve-attendance-session.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/attendance-session.entity";
import type { AbsentStudentProjection } from "@/app/class-track/feats/attendance/domain/projections/AbsentStudent.projection";
import type { StudentInClassProjection } from "@/app/class-track/core/students/domain/projections/StudentInClass.projection";
import type { AttendanceSessionStatus } from "@/data/models/class-track/attendance-session.model";

export abstract class AttendanceSessionDatasource {
    public abstract closeOrphanSessions(): Promise<number>;
    public abstract startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity>;
    public abstract endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity>;
    public abstract approveSession(dto: ApproveAttendanceSessionDto): Promise<AttendanceSessionEntity>;
    public abstract getStudentsAbsentForMoreThan(days: number): Promise<AbsentStudentProjection[]>;
    public abstract getActiveSessionsWithStudentDetails(status: AttendanceSessionStatus): Promise<StudentInClassProjection[]>;
    public abstract getAttendanceSessionById(id: string): Promise<AttendanceSessionEntity | null>;
}
