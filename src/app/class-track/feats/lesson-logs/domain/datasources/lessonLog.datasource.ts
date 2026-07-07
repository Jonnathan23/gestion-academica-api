import type { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/CreateLessongLog.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/LessonLog.entity";
import type { GetLastLessonLogDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/GetLastLessonLog.dto";

export abstract class LessonLogDataSource {
    public abstract createLessonLogs(dto: CreateLessonLogsDto): Promise<LessonLogEntity[]>;
    public abstract getLastLessonLog(dto: GetLastLessonLogDto): Promise<LessonLogEntity | null>;
}
