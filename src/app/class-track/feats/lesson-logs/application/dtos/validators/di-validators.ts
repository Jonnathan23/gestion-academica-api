import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { createLessonLogsSchema } from "@/app/class-track/feats/lesson-logs/application/dtos/validators/schemas/valibot/create-lesson-log.schema";
import { getLastLessonLogSchema } from "@/app/class-track/feats/lesson-logs/application/dtos/validators/schemas/valibot/get-last-lesson-log.schema";
import { LessonLogsValidatorsImpl } from "@/app/class-track/feats/lesson-logs/application/dtos/validators/validator";
import type { CreateLessonLogsProps } from "@/app/class-track/feats/lesson-logs/application/dtos/interfaces/create-lesson-log.interface";
import type { GetLastLessonLogProps } from "@/app/class-track/feats/lesson-logs/application/dtos/interfaces/get-last-lesson-log.interface";

const createLessonLogsValidator = createValidator<CreateLessonLogsProps>(createLessonLogsSchema);
const getLastLessonLogValidator = createValidator<GetLastLessonLogProps>(getLastLessonLogSchema);

export const lessonLogsValidators = new LessonLogsValidatorsImpl(createLessonLogsValidator, getLastLessonLogValidator);
