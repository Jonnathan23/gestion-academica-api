import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { GetCountAlertsProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/get-count-alerts.interface";
import type { RetentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";

export class GetCountAlertsDto {
    private constructor(public readonly status: RetentionAlertStatus) {}

    public static create(props: Record<string, unknown>, validator: EntityValidator<GetCountAlertsProps>): GetCountAlertsDto {
        const validatedData = validator.validate(props);

        return new GetCountAlertsDto(validatedData.status);
    }
}
