import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { AttendanceValidators } from "@/app/class-track/feats/attendance/application/dtos/validators/interfaces/attendance-validators.interface";
import type { ApproveAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/approve-attendance-session.interface";
import type { EndAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/end-attendance-session.interface";
import type { RegisterLessonLogProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/register-lesson-log.interface";
import type { StartAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/start-attendance-session.interface";

export class AttendanceValidatorsImpl implements AttendanceValidators {
    public constructor(
        public readonly approveAttendanceSessionValidator: EntityValidator<ApproveAttendanceSessionProps>,
        public readonly endAttendanceSessionValidator: EntityValidator<EndAttendanceSessionProps>,
        public readonly registerLessonLogValidator: EntityValidator<RegisterLessonLogProps>,
        public readonly startAttendanceSessionValidator: EntityValidator<StartAttendanceSessionProps>,
    ) {}
}
