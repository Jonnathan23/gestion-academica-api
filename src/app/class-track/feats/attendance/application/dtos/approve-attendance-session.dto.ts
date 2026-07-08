import type { ApproveAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/approve-attendance-session.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class ApproveAttendanceSessionDto {
    private constructor(
        public readonly sessionId: string,
        public readonly teacherId: string,
    ) {}

    public static create(
        object: Record<string, unknown>,
        teacherId: string,
        validator: EntityValidator<ApproveAttendanceSessionProps>,
    ): ApproveAttendanceSessionDto {
        const validatedData = validator.validate({ ...object, teacherId });

        return new ApproveAttendanceSessionDto(validatedData.sessionId, validatedData.teacherId);
    }
}
