import { Op } from "sequelize";
import AttendanceSession from "@/data/models/ClassTrack/AttendanceSession.model";
import { CustomError } from "@/core/error/customError.error";
import { AttendanceSessionDatasource } from "@/app/class-track/attendance/domain/datasource/AttendanceSession.datasource";
import type { StartAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/StartAttendanceSession.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/EndAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/attendance/domain/entities/AttendanceSession.entity";
import { AttendanceSessionMapper } from "@/app/class-track/attendance/infrastructure/mappers/attendanceSession.mapper";

export class AttendanceSessionDatasourceImpl implements AttendanceSessionDatasource {
    public async startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        const { studentId, entryTime } = dto;

        try {
            const newSession = await AttendanceSession.create({
                at_se_student_id: studentId,
                at_se_session_date: entryTime,
                at_se_entry_time: entryTime,
                at_se_status: "IN_PROGRESS",
            });

            return AttendanceSessionMapper.entityFromObject(newSession);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer("Error starting attendance session");
        }
    }

    public async endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        try {
            const session = await AttendanceSession.findByPk(dto.sessionId);

            if (!session) {
                throw CustomError.notFound("Attendance session not found");
            }

            if (session.at_se_status !== "IN_PROGRESS") {
                throw CustomError.conflict("Session is not IN_PROGRESS");
            }

            const exitTime = dto.exitTime;
            const entryTime = new Date(session.at_se_entry_time);

            // calculate total minutes
            const diffMs = exitTime.getTime() - entryTime.getTime();
            const totalMinutes = Math.floor(diffMs / 60000);

            await session.update({
                at_se_teacher_id: dto.teacherId,
                at_se_exit_time: exitTime,
                at_se_total_minutes: totalMinutes,
                at_se_status: "PENDING_APPROVAL",
            });

            return AttendanceSessionMapper.entityFromObject(session);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer("Error ending attendance session");
        }
    }

    public async getStudentsAbsentForMoreThan(days: number): Promise<{ studentId: string; daysAbsent: number }[]> {
        try {
            const results = await AttendanceSession.findAll({
                attributes: [
                    "at_se_student_id",
                    [AttendanceSession.sequelize!.fn("MAX", AttendanceSession.sequelize!.col("at_se_entry_time")), "lastAttendance"],
                ],
                group: ["at_se_student_id"],
                raw: true,
            });

            const today = new Date();
            const absentStudents: { studentId: string; daysAbsent: number }[] = [];

            for (const row of results as unknown as Array<{ at_se_student_id: string; lastAttendance: string }>) {
                if (!row.lastAttendance) continue;
                const lastDate = new Date(row.lastAttendance);
                const diffTime = today.getTime() - lastDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > days) {
                    absentStudents.push({ studentId: row.at_se_student_id, daysAbsent: diffDays });
                }
            }

            return absentStudents;
        } catch (error) {
            throw CustomError.internalServer("Error retrieving absent students");
        }
    }

    public async closeOrphanSessions(): Promise<number> {
        const transaction = await AttendanceSession.sequelize?.transaction();

        if (!transaction) {
            throw CustomError.internalServer("Error initializing database transaction");
        }

        try {
            const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

            const orphanSessions = await AttendanceSession.findAll({
                where: {
                    at_se_status: "IN_PROGRESS",
                    at_se_entry_time: {
                        [Op.lt]: twelveHoursAgo,
                    },
                },
                transaction,
            });

            let updatedCount = 0;

            for (const session of orphanSessions) {
                const exitTime = new Date(session.at_se_entry_time.getTime() + 12 * 60 * 60 * 1000);

                await session.update(
                    {
                        at_se_exit_time: exitTime,
                        at_se_total_minutes: 720,
                        at_se_status: "APPROVED",
                    },
                    { transaction },
                );

                updatedCount++;
            }

            await transaction.commit();
            return updatedCount;
        } catch (error) {
            await transaction.rollback();
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer("Error closing orphan sessions");
        }
    }
}
