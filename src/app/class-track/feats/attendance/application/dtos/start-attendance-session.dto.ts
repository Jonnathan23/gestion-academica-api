import type { StartAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/start-attendance-session.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class StartAttendanceSessionDto {
    private constructor(
        public readonly studentId: string,
        public readonly entryTime: Date,
    ) {}

    public static create(
        object: Record<string, unknown>,
        validator: EntityValidator<StartAttendanceSessionProps>,
    ): StartAttendanceSessionDto {
        const validatedData = validator.validate(object);

        return new StartAttendanceSessionDto(validatedData.studentId, validatedData.entryTime);
    }
}
