import { AttendanceSessionRepository } from "@/app/class-track/attendance/domain/repositories/AttendanceSession.repository";

export class CloseOrphanSessionsUseCase {
    constructor(private readonly repository: AttendanceSessionRepository) {}

    public async execute(): Promise<number> {
        return await this.repository.closeOrphanSessions();
    }
}
