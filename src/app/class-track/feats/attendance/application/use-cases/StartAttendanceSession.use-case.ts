import { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/AttendanceSession.repository";
import { StudentProjectionRepository } from "@/app/class-track/feats/attendance/domain/repositories/StudentProjection.repository";
import type { StartAttendanceSessionDto } from "@/app/class-track/feats/attendance/domain/dtos/StartAttendanceSession.dto";
import type { AttendanceSessionEntity } from "@/app/class-track/feats/attendance/domain/entities/AttendanceSession.entity";
import { CustomError } from "@/core/error/customError.error";

export class StartAttendanceSessionUseCase {
    constructor(
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
        private readonly studentProjectionRepository: StudentProjectionRepository,
    ) {}

    public async execute(dto: StartAttendanceSessionDto): Promise<AttendanceSessionEntity> {
        const studentProfile = await this.studentProjectionRepository.getActiveStudentProfile(dto.studentId);

        if (studentProfile.isContractFrozen) {
            throw CustomError.forbidden("Contract is frozen");
        }

        return await this.attendanceSessionRepository.startSession(dto);
    }
}
