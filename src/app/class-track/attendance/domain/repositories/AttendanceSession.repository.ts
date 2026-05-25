export abstract class AttendanceSessionRepository {
    public abstract closeOrphanSessions(): Promise<number>;
}
