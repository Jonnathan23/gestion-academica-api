import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { LessonLogsValidators } from "@/app/class-track/feats/lesson-logs/application/dtos/validators/interfaces/lesson-logs-validators.interface";
import type { CreateLessonLogsProps } from "@/app/class-track/feats/lesson-logs/application/dtos/interfaces/create-lesson-log.interface";
import type { GetLastLessonLogProps } from "@/app/class-track/feats/lesson-logs/application/dtos/interfaces/get-last-lesson-log.interface";

export class LessonLogsValidatorsImpl implements LessonLogsValidators {
    public constructor(
        public readonly createLessonLogsValidator: EntityValidator<CreateLessonLogsProps>,
        public readonly getLastLessonLogValidator: EntityValidator<GetLastLessonLogProps>,
    ) {}
}
