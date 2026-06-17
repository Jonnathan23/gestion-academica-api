import type { LessonLogDataSource } from "@/app/class-track/feats/lesson-logs/domain/datasources/lessonLog.datasource";
import type { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/CreateLessongLog.dto";
import type { GetLastLessonLogDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/GetLastLessonLog.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/LessonLog.entity";
import { LessonLogMapper } from "@/app/class-track/feats/lesson-logs/infrastructure/mappers/lessonLog.mapper";
import { CustomError } from "@/core/error/customError.error";

import LessonLog from "@/data/models/class-track/LessonLog.model";
import AttendanceSession from "@/data/models/class-track/AttendanceSession.model";

export class LessonLogDataSourceImpl implements LessonLogDataSource {
    public async createLessonLogs(dto: CreateLessonLogsDto): Promise<LessonLogEntity[]> {
        const sequelize = LessonLog.sequelize;
        if (!sequelize) throw CustomError.serviceUnavailable("Database connection not found");

        const transactionLessonLogs = await sequelize.transaction();

        try {
            const createdLogs: LessonLog[] = [];

            for (const lesson of dto.lessonsStudied) {
                const newLog = await LessonLog.create(
                    {
                        le_lo_attendance_session_id: dto.attendanceSessionId,
                        le_lo_lesson_number: lesson.lessonNumber,
                        le_lo_oral_practice_score: lesson.oralPracticeScore,
                        le_lo_is_completed: lesson.isCompleted,
                    },
                    { transaction: transactionLessonLogs },
                );
                createdLogs.push(newLog);
            }

            const entities = this.convertArrayToEntity(createdLogs);
            await transactionLessonLogs.commit();
            return entities;
        } catch (error) {
            await transactionLessonLogs.rollback();
            if (error instanceof CustomError) {
                console.log(error);
                throw error;
            }
            console.log(error);
            throw CustomError.internalServer("Error creating lesson logs in database");
        }
    }

    private convertArrayToEntity(logs: LessonLog[]): LessonLogEntity[] {
        return logs.map((log) => LessonLogMapper.lessonLogEntityFromObject(log.toJSON()));
    }

    public async getLastLessonLog(dto: GetLastLessonLogDto): Promise<LessonLogEntity | null> {
        const lastLog = await LessonLog.findOne({
            include: [
                {
                    model: AttendanceSession,
                    where: { at_se_student_id: dto.studentId },
                    required: true,
                },
            ],
            order: [["le_lo_created_at", "DESC"]],
        });

        if (!lastLog) return null;
        return LessonLogMapper.lessonLogEntityFromObject(lastLog.toJSON());
    }
}
