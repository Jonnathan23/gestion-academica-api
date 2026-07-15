import type { EndAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/end-attendance-session.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class EndAttendanceSessionDto {
    private constructor(
        public readonly sessionId: string,
        public readonly exitTime: Date,
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<EndAttendanceSessionProps>): EndAttendanceSessionDto {
        const validatedData = validator.validate(object);

        return new EndAttendanceSessionDto(validatedData.sessionId, validatedData.exitTime);
    }
}
