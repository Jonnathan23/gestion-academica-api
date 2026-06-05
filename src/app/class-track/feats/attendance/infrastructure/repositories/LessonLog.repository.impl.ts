import type { LessonLogRepository } from "@/app/class-track/feats/attendance/domain/repositories/LessonLog.repository";
import type { LessonLogDatasource } from "@/app/class-track/feats/attendance/domain/datasource/LessonLog.datasource";
import type { RegisterLessonLogDto } from "@/app/class-track/feats/attendance/domain/dtos/RegisterLessonLog.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/attendance/domain/entities/LessonLog.entity";

export class LessonLogRepositoryImpl implements LessonLogRepository {
    constructor(private readonly datasource: LessonLogDatasource) {}

    public async getDailyLessonCount(sessionId: string, date: Date): Promise<number> {
        return this.datasource.getDailyLessonCount(sessionId, date);
    }

    public async registerLessonLog(dto: RegisterLessonLogDto): Promise<LessonLogEntity> {
        return this.datasource.registerLessonLog(dto);
    }
}
