import { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";

import type { StartAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/start-attendance-session.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/attendance-session.entity";
import { CustomError } from "@/core/error/customError.error";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";

export class StartAttendanceSessionUseCase {
    public constructor(
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
        private readonly studentProjectionRepository: StudentClassTrackRepository,
    ) {}

    public async execute(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        const studentProfile = await this.studentProjectionRepository.findStudentWithLevelActive(dto.studentId);

        if (!studentProfile.isContractValid) {
            throw CustomError.forbidden("The student does not have active contracts");
        }

        return await this.attendanceSessionRepository.startSession(dto);
    }
}
