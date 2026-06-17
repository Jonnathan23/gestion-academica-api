import { Op } from "sequelize";
import AttendanceSession, { type AttendanceSessionStatus } from "@/data/models/class-track/AttendanceSession.model";
import { CustomError } from "@/core/error/customError.error";
import { AttendanceSessionDatasource } from "@/app/class-track/feats/attendance/domain/datasource/attendanceSession.datasource";
import type { StartAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/StartAttendanceSession.dto";
import type { EndAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/EndAttendanceSession.dto";
import type { ApproveAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/ApproveAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/AttendanceSession.entity";
import type { AbsentStudentProjection } from "@/app/class-track/feats/attendance/domain/projections/AbsentStudent.projection";
import { AbsentStudentMapper } from "@/app/class-track/feats/attendance/infrastructure/mappers/absentStudent.mapper";
import { StudentInClassProjection } from "@/app/class-track/core/students/domain/projections/StudentInClass.projection";
import { StudentInClassMapper } from "@/app/class-track/core/students/infrastructure/mappers/studentInClass.mapper";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/Attendance.interface";
import Student from "@/data/models/admin-desk/Student.model";
import { AttendanceSessionMapper } from "@/app/class-track/feats/attendance/infrastructure/mappers/attendanceSession.mapper";
import StudentModule from "@/data/models/admin-desk/StudentModule.model";
import { studentModuleStatus } from "@/core/interfaces/Contracts.interface";

interface AbsentStudentQueryRow {
    at_se_student_id: string;
    lastAttendance: Date;
    student: Record<string, any>;
}

export class AttendanceSessionDatasourceImpl implements AttendanceSessionDatasource {
    public async startSession(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        const { studentId, entryTime } = dto;

        const newSession = await AttendanceSession.create({
            at_se_student_id: studentId,
            at_se_session_date: entryTime,
            at_se_entry_time: entryTime,
            at_se_status: attendanceSessionStatus.InProgress,
        });

        return this.convertToAttendanceSessionEntity(newSession);
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
            at_se_exit_time: exitTime,
            at_se_total_minutes: totalMinutes,
            at_se_status: attendanceSessionStatus.PendingApproval,
        });

        return this.convertToAttendanceSessionEntity(session);
    }

    public async approveSession(dto: ApproveAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        const session = await AttendanceSession.findByPk(dto.sessionId);

        if (!session) {
            throw CustomError.notFound("Attendance session not found");
        }

        if (session.at_se_status !== attendanceSessionStatus.PendingApproval) {
            throw CustomError.conflict("Session is not PENDING_APPROVAL");
        }

        await session.update({
            at_se_teacher_id: dto.teacherId,
            at_se_status: attendanceSessionStatus.Approved,
        });

        return this.convertToAttendanceSessionEntity(session);
    }

    public async getStudentsAbsentForMoreThan(days: number): Promise<AbsentStudentProjection[]> {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - days);

        const sessionResults = (await AttendanceSession.findAll({
            attributes: [
                "at_se_student_id",
                [AttendanceSession.sequelize!.fn("MAX", AttendanceSession.sequelize!.col("at_se_entry_time")), "lastAttendance"],
            ],
            group: ["at_se_student_id"],
            having: AttendanceSession.sequelize!.where(
                AttendanceSession.sequelize!.fn("MAX", AttendanceSession.sequelize!.col("at_se_entry_time")),
                { [Op.lt]: targetDate },
            ),
            raw: true,
        })) as unknown as { at_se_student_id: string; lastAttendance: string }[];

        if (sessionResults.length === 0) return [];

        const studentIds = sessionResults.map((r) => r.at_se_student_id);

        const students = await Student.findAll({
            where: {
                st_id: {
                    [Op.in]: studentIds,
                },
            },
            raw: true,
            nest: true,
        });

        const combinedResults: AbsentStudentQueryRow[] = sessionResults.map((sessionResult) => {
            const student = students.find((s) => s.st_id === sessionResult.at_se_student_id);
            return {
                at_se_student_id: sessionResult.at_se_student_id,
                lastAttendance: new Date(sessionResult.lastAttendance),
                student: student as Record<string, any>,
            };
        });

        return this.convertArrayToAbsentStudentProjections(combinedResults);
    }

    private convertArrayToAbsentStudentProjections(attendanceSessions: AbsentStudentQueryRow[]): AbsentStudentProjection[] {
        const today = new Date();

        return attendanceSessions.map((row) => {
            const lastDate = new Date(row.lastAttendance);
            const diffMs = today.getTime() - lastDate.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            return AbsentStudentMapper.projectionFromObject(row, diffDays, lastDate);
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

    private convertToAttendanceSessionEntity(object: AttendanceSession): AttendanceSessionEntity {
        return AttendanceSessionMapper.entityFromObject(object);
    }

    public async getActiveSessionsWithStudentDetails(status: AttendanceSessionStatus): Promise<StudentInClassProjection[]> {
        const sessions = await AttendanceSession.findAll({
            where: {
                at_se_status: status,
            },
            include: [
                {
                    model: Student,
                    as: "student",
                    required: true,
                    attributes: ["st_id", "st_full_name"],
                    include: [
                        {
                            model: StudentModule,
                            required: true,
                            attributes: ["st_mod_module_id"],
                            where: {
                                st_mod_status: studentModuleStatus.Active,
                            },
                        },
                    ],
                },
            ],
        });

        return this.convertArrayToStudentInClassProjections(sessions);
    }

    private convertArrayToStudentInClassProjections(attendanceSessions: AttendanceSession[]): StudentInClassProjection[] {
        return attendanceSessions.map((attendanceSession) => StudentInClassMapper.projectionFromDbRecord(attendanceSession));
    }
}
