import type { StartAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/StartAttendanceSession.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/EndAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/attendance/domain/entities/AttendanceSession.entity";

export abstract class AttendanceSessionDatasource {
    public abstract closeOrphanSessions(): Promise<number>;
    public abstract startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity>;
    public abstract endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity>;
}
