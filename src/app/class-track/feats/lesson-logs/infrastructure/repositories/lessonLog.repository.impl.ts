import type { LessonLogDataSource } from "@/app/class-track/feats/lesson-logs/domain/datasources/lessonLog.datasource";
import type { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/CreateLessongLog.dto";
import type { GetLastLessonLogDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/GetLastLessonLog.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/LessonLog.entity";
import type { LessonLogRepository } from "@/app/class-track/feats/lesson-logs/domain/repositories/lessonLog.repository";

export class LessonLogRepositoryImpl implements LessonLogRepository {
    constructor(private readonly datasource: LessonLogDataSource) {}

    public createLessonLogs(dto: CreateLessonLogsDto): Promise<LessonLogEntity[]> {
        return this.datasource.createLessonLogs(dto);
    }

    public getLastLessonLog(dto: GetLastLessonLogDto): Promise<LessonLogEntity | null> {
        return this.datasource.getLastLessonLog(dto);
    }
}
