import { AttendanceSessionRepository } from "@/app/class-track/attendance/domain/repositories/AttendanceSession.repository";
import { AttendanceSessionDatasource } from "@/app/class-track/attendance/domain/datasource/AttendanceSession.datasource";

export class AttendanceSessionRepositoryImpl implements AttendanceSessionRepository {
    constructor(private readonly datasource: AttendanceSessionDatasource) {}

    public async closeOrphanSessions(): Promise<number> {
        return this.datasource.closeOrphanSessions();
    }
}
