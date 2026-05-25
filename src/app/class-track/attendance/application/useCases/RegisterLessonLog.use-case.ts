import type { LessonLogRepository } from "@/app/class-track/attendance/domain/repositories/LessonLog.repository";
import type { RegisterLessonLogDto } from "@/app/class-track/attendance/domain/dtos/RegisterLessonLog.dto";
import type { LessonLogEntity } from "@/app/class-track/attendance/domain/entities/LessonLog.entity";
import { CustomError } from "@/core/error/customError.error";
import { moduleLimitsDictionary } from "@/app/class-track/core/enums/ModuleLimits.enum";

export class RegisterLessonLogUseCase {
    constructor(private readonly lessonLogRepository: LessonLogRepository) {}

    public async execute(dto: RegisterLessonLogDto): Promise<LessonLogEntity> {
        const limit = moduleLimitsDictionary[dto.activeModule];
        if (limit === undefined) {
            throw CustomError.badRequest("Invalid active module provided");
        }

        const parsedLessonNumber = parseInt(dto.lessonNumber, 10);
        if (isNaN(parsedLessonNumber)) {
            throw CustomError.badRequest("Lesson number must be numeric to validate limits");
        }

        if (parsedLessonNumber > limit) {
            throw CustomError.conflict("Lesson exceeds module limits");
        }

        const dailyCount = await this.lessonLogRepository.getDailyLessonCount(dto.attendanceSessionId, new Date());

        if (dailyCount >= 3) {
            throw CustomError.conflict("Daily lesson limit reached");
        }

        return await this.lessonLogRepository.registerLessonLog(dto);
    }
}
