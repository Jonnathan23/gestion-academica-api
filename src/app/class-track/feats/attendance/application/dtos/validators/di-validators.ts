import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { approveAttendanceSessionSchema } from "@/app/class-track/feats/attendance/application/dtos/validators/schemas/valibot/approve-attendance-session.schema";
import { endAttendanceSessionSchema } from "@/app/class-track/feats/attendance/application/dtos/validators/schemas/valibot/end-attendance-session.schema";
import { registerLessonLogSchema } from "@/app/class-track/feats/attendance/application/dtos/validators/schemas/valibot/register-lesson-log.schema";
import { startAttendanceSessionSchema } from "@/app/class-track/feats/attendance/application/dtos/validators/schemas/valibot/start-attendance-session.schema";
import { AttendanceValidatorsImpl } from "@/app/class-track/feats/attendance/application/dtos/validators/validator";
import type { ApproveAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/approve-attendance-session.interface";
import type { EndAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/end-attendance-session.interface";
import type { RegisterLessonLogProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/register-lesson-log.interface";
import type { StartAttendanceSessionProps } from "@/app/class-track/feats/attendance/application/dtos/interfaces/start-attendance-session.interface";

const approveAttendanceSessionValidator = createValidator<ApproveAttendanceSessionProps>(approveAttendanceSessionSchema);
const endAttendanceSessionValidator = createValidator<EndAttendanceSessionProps>(endAttendanceSessionSchema);
const registerLessonLogValidator = createValidator<RegisterLessonLogProps>(registerLessonLogSchema);
const startAttendanceSessionValidator = createValidator<StartAttendanceSessionProps>(startAttendanceSessionSchema);

export const attendanceValidators = new AttendanceValidatorsImpl(
    approveAttendanceSessionValidator,
    endAttendanceSessionValidator,
    registerLessonLogValidator,
    startAttendanceSessionValidator,
);
