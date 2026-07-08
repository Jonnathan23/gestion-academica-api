import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { ChangeRetentionAlertStatusProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/change-retention-alert-status.interface";
import type { RetentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";

export class ChangeRetentionAlertStatusDto {
    private constructor(public readonly status: RetentionAlertStatus) {}

    public static create(
        props: Record<string, unknown>,
        validator: EntityValidator<ChangeRetentionAlertStatusProps>,
    ): ChangeRetentionAlertStatusDto {
        const validatedData = validator.validate(props);

        return new ChangeRetentionAlertStatusDto(validatedData.status);
    }
}
