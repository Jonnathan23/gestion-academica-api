import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { UpdateRetentionAlertProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/update-retention-alert.interface";

export class UpdateRetentionAlertDto {
    private constructor(
        public readonly hasResponded: boolean,
        public readonly isJustified: boolean,
        public readonly observations: string,
        public readonly contactDate?: Date,
        public readonly justificationReason?: string,
        public readonly returnDeadline?: Date,
    ) {}

    public static create(props: Record<string, unknown>, validator: EntityValidator<UpdateRetentionAlertProps>): UpdateRetentionAlertDto {
        const validatedData = validator.validate(props);

        const parsedContactDate = validatedData.contactDate ? new Date(validatedData.contactDate) : undefined;
        const parsedReturnDeadline = validatedData.returnDeadline ? new Date(validatedData.returnDeadline) : undefined;

        return new UpdateRetentionAlertDto(
            validatedData.hasResponded,
            validatedData.isJustified,
            validatedData.observations,
            parsedContactDate,
            validatedData.justificationReason,
            parsedReturnDeadline,
        );
    }
}
