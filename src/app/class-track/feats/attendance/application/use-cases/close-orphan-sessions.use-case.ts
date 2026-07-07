import { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendance-session.repository";

export class CloseOrphanSessionsUseCase {
    public constructor(private readonly repository: AttendanceSessionRepository) {}

    public async execute(): Promise<number> {
        return await this.repository.closeOrphanSessions();
    }
}
