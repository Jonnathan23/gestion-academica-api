import { Op } from "sequelize";
import LessonLog from "@/data/models/ClassTrack/LessonLog.model";
import { CustomError } from "@/core/error/customError.error";
import type { LessonLogDatasource } from "@/app/class-track/attendance/domain/datasource/LessonLog.datasource";
import type { RegisterLessonLogDto } from "@/app/class-track/attendance/domain/dtos/RegisterLessonLog.dto";
import type { LessonLogEntity } from "@/app/class-track/attendance/domain/entities/LessonLog.entity";
import { LessonLogMapper } from "@/app/class-track/attendance/infrastructure/mappers/lessonLog.mapper";

export class LessonLogDatasourceImpl implements LessonLogDatasource {
    public async getDailyLessonCount(sessionId: string, date: Date): Promise<number> {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const count = await LessonLog.count({
                where: {
                    le_lo_attendance_session_id: sessionId,
                    le_lo_created_at: {
                        [Op.gte]: startOfDay,
                        [Op.lte]: endOfDay,
                    },
                },
            });

            return count;
        } catch (error) {
            throw CustomError.internalServer("Error retrieving daily lesson count");
        }
    }

    public async registerLessonLog(dto: RegisterLessonLogDto): Promise<LessonLogEntity> {
        try {
            const newLog = await LessonLog.create({
                le_lo_attendance_session_id: dto.attendanceSessionId,
                le_lo_lesson_number: dto.lessonNumber,
                le_lo_notes: dto.notes,
            });

            return LessonLogMapper.entityFromObject(newLog);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer("Error registering lesson log");
        }
    }
}
