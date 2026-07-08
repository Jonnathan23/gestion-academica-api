import type { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/application/dtos/create-lessong-log.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/lesson-log.entity";
import type { GetLastLessonLogDto } from "@/app/class-track/feats/lesson-logs/application/dtos/get-last-lesson-log.dto";

export abstract class LessonLogRepository {
    public abstract createLessonLogs(dto: CreateLessonLogsDto): Promise<LessonLogEntity[]>;
    public abstract getLastLessonLog(dto: GetLastLessonLogDto): Promise<LessonLogEntity | null>;
}
