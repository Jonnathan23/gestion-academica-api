import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { ApproveAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/approve-attendance-session.interface";
import type { EndAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/end-attendance-session.interface";
import type { RegisterLessonLogProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/register-lesson-log.interface";
import type { StartAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/start-attendance-session.interface";

export interface AttendanceValidators {
    approveAttendanceSessionValidator: EntityValidator<ApproveAttendanceSessionProps>;
    endAttendanceSessionValidator: EntityValidator<EndAttendanceSessionProps>;
    registerLessonLogValidator: EntityValidator<RegisterLessonLogProps>;
    startAttendanceSessionValidator: EntityValidator<StartAttendanceSessionProps>;
}
