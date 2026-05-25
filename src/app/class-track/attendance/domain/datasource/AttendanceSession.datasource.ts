export abstract class AttendanceSessionDatasource {
    public abstract closeOrphanSessions(): Promise<number>;
}
