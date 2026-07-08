import type { LessonLogDataSource } from "@/app/class-track/feats/lesson-logs/domain/datasources/lesson-log.datasource";
import type { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/application/dtos/create-lessong-log.dto";
import type { GetLastLessonLogDto } from "@/app/class-track/feats/lesson-logs/application/dtos/get-last-lesson-log.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/lesson-log.entity";
import type { LessonLogRepository } from "@/app/class-track/feats/lesson-logs/domain/repositories/lesson-log.repository";

export class LessonLogRepositoryImpl implements LessonLogRepository {
    public constructor(private readonly datasource: LessonLogDataSource) {}

    public createLessonLogs(dto: CreateLessonLogsDto): Promise<LessonLogEntity[]> {
        return this.datasource.createLessonLogs(dto);
    }

    public getLastLessonLog(dto: GetLastLessonLogDto): Promise<LessonLogEntity | null> {
        return this.datasource.getLastLessonLog(dto);
    }
}
