import type { StartAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/StartAttendanceSession.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/EndAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/attendance/domain/entities/AttendanceSession.entity";
import type { AbsentStudentProjection } from "@/app/class-track/attendance/domain/projections/AbsentStudent.projection";

export abstract class AttendanceSessionDatasource {
    public abstract closeOrphanSessions(): Promise<number>;
    public abstract startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity>;
    public abstract endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity>;
    public abstract getStudentsAbsentForMoreThan(days: number): Promise<AbsentStudentProjection[]>;
}
