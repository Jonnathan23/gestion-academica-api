import { CustomError } from "@/core/error";

import { MIN_MAX_LESSONS_MODULE } from "@/app/class-track/core/enums/ModuleLimits.enum";

import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";

import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";

import type { LessonLogRepository } from "@/app/class-track/feats/lesson-logs/domain/repositories/lessonLog.repository";
import type { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/create-lessong-log.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/lesson-log.entity";

export class CreateLessonLogsUseCase {
    public constructor(
        private readonly repository: LessonLogRepository,
        private readonly studentRepository: StudentClassTrackRepository,
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
    ) {}

    public async execute(dto: CreateLessonLogsDto): Promise<LessonLogEntity[]> {
        await this.validate(dto);

        return await this.repository.createLessonLogs(dto);
    }

    private async validate(dto: CreateLessonLogsDto) {
        const { attendanceSessionId } = dto;

        const studentId = await this.validationAttendanceSession(attendanceSessionId);
        const activeModuleLevel = await this.validationStudent(studentId);

        await this.validationRangeLessons(dto.lessonsStudied, activeModuleLevel);
    }

    private async validationRangeLessons(lessons: CreateLessonLogsDto["lessonsStudied"], activeModuleLevel: number): Promise<void> {
        if (lessons.length === 0) return;

        const limits = MIN_MAX_LESSONS_MODULE.find((moduleLimit) => moduleLimit.level === activeModuleLevel);

        if (!limits) {
            throw CustomError.badRequest("Invalid active module level limits");
        }

        for (let i = 0; i < lessons.length; i++) {
            const currentLesson = lessons[i];

            if (!currentLesson) {
                continue;
            }
            if (currentLesson.lessonNumber < limits.minLesson || currentLesson.lessonNumber > limits.maxLesson) {
                throw CustomError.badRequest(`Lessons must be within the active module range (${limits.minLesson} - ${limits.maxLesson})`);
            }
        }
    }

    private async validationAttendanceSession(attendanceSessionId: string): Promise<string> {
        const attendanceSession = await this.attendanceSessionRepository.getAttendanceSessionById(attendanceSessionId);

        if (!attendanceSession) {
            throw CustomError.notFound("Session not found");
        }

        if (attendanceSession.atSeStatus !== attendanceSessionStatus.InProgress) {
            throw CustomError.badRequest("Session is not active");
        }

        return attendanceSession.atSeStudentId;
    }

    private async validationStudent(studentId: string): Promise<number> {
        const student = await this.studentRepository.findStudentWithLevelActiveDetails(studentId);

        if (!student.activeModule) {
            throw CustomError.badRequest("Student has no active module");
        }

        if (!student.isContractValid) {
            throw CustomError.badRequest("Student has no active contract");
        }

        return student.moduleInfo.moLevel;
    }
}
