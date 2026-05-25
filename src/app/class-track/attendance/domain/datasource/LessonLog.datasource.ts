import type { RegisterLessonLogDto } from "@/app/class-track/attendance/domain/dtos/RegisterLessonLog.dto";
import type { LessonLogEntity } from "@/app/class-track/attendance/domain/entities/LessonLog.entity";

export abstract class LessonLogDatasource {
    public abstract getDailyLessonCount(sessionId: string, date: Date): Promise<number>;
    public abstract registerLessonLog(dto: RegisterLessonLogDto): Promise<LessonLogEntity>;
}
