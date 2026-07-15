import { CustomError } from "@/core/error/customError.error";
import type { LessonLogRepository } from "@/app/class-track/feats/lesson-logs/domain/repositories/lesson-log.repository";
import type { GetLastLessonLogDto } from "@/app/class-track/feats/lesson-logs/application/dtos/get-last-lesson-log.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/lesson-log.entity";

export class GetLastLessonLogUseCase {
    public constructor(private readonly repository: LessonLogRepository) {}

    public async execute(dto: GetLastLessonLogDto): Promise<LessonLogEntity> {
        const lastLog = await this.repository.getLastLessonLog(dto);

        if (!lastLog) {
            throw CustomError.notFound("No lesson logs found for this student");
        }

        return lastLog;
    }
}
