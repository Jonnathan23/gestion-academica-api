import { Op } from "sequelize";
import AttendanceSession from "@/data/models/ClassTrack/AttendanceSession.model";
import { CustomError } from "@/core/error/customError.error";
import { AttendanceSessionDatasource } from "@/app/class-track/attendance/domain/datasource/AttendanceSession.datasource";
import type { StartAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/StartAttendanceSession.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/attendance/domain/dtos/EndAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/attendance/domain/entities/AttendanceSession.entity";
import { AttendanceSessionMapper } from "@/app/class-track/attendance/infrastructure/mappers/attendanceSession.mapper";
import type { AbsentStudentProjection } from "@/app/class-track/attendance/domain/projections/AbsentStudent.projection";
import { AbsentStudentMapper } from "@/app/class-track/attendance/infrastructure/mappers/absentStudent.mapper";
import { Student } from "@/data/models/AdminDesk";
import { attendanceSessionStatus } from "@/app/class-track/attendance/domain/interfaces/attendance.interface";

export class AttendanceSessionDatasourceImpl implements AttendanceSessionDatasource {
    public async startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        const { studentId, entryTime } = dto;

        const newSession = await AttendanceSession.create({
            at_se_student_id: studentId,
            at_se_session_date: entryTime,
            at_se_entry_time: entryTime,
            at_se_status: attendanceSessionStatus.InProgress,
        });

        return this.convertToEntity(newSession);
    }

    public async endSession(dto: EndAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        const session = await AttendanceSession.findByPk(dto.sessionId);

        if (!session) {
            throw CustomError.notFound("Attendance session not found");
        }

        if (session.at_se_status !== attendanceSessionStatus.InProgress) {
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
            at_se_status: attendanceSessionStatus.PendingApproval,
        });

        return this.convertToEntity(session);
    }

    public async getStudentsAbsentForMoreThan(days: number): Promise<AbsentStudentProjection[]> {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - days);

        const results = await AttendanceSession.findAll({
            attributes: [
                "at_se_student_id",
                [AttendanceSession.sequelize!.fn("MAX", AttendanceSession.sequelize!.col("at_se_entry_time")), "lastAttendance"],
            ],
            include: [
                {
                    model: Student,
                    as: "student",
                    attributes: ["st_id", "st_identification_card", "st_full_name", "st_phone_number", "st_email"],
                },
            ],
            group: [
                "at_se_student_id",
                "student.st_id",
                "student.st_identification_card",
                "student.st_full_name",
                "student.st_phone_number",
                "student.st_email",
            ],
            having: AttendanceSession.sequelize!.where(
                AttendanceSession.sequelize!.fn("MAX", AttendanceSession.sequelize!.col("at_se_entry_time")),
                { [Op.lt]: targetDate },
            ),
        });

        const today = new Date();

        return results.map((row) => {
            const rowJSON = row.toJSON() as any;
            const lastDate = new Date(rowJSON.lastAttendance);
            const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            return AbsentStudentMapper.projectionFromObject(rowJSON, diffDays, lastDate);
        });
    }

    public async closeOrphanSessions(): Promise<number> {
        const sequelize = AttendanceSession.sequelize;
        if (!sequelize) {
            throw CustomError.internalServer("Error initializing database transaction");
        }

        return await sequelize.transaction(async (transaction) => {
            const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

            const orphanSessions = await AttendanceSession.findAll({
                where: {
                    at_se_status: attendanceSessionStatus.InProgress,
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
                        at_se_status: attendanceSessionStatus.Approved,
                    },
                    { transaction },
                );

                updatedCount++;
            }

            return updatedCount;
        });
    }

    private convertToEntity(object: AttendanceSession): AttendanceSessionEntity {
        return AttendanceSessionMapper.entityFromObject(object);
    }
}
