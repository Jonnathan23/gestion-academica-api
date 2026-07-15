import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { RetentionAlertsValidators } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/interfaces/retention-alerts-validators.interface";
import type { ChangeRetentionAlertStatusProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/change-retention-alert-status.interface";
import type { GetCountAlertsProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/get-count-alerts.interface";
import type { GetRetentionAlertsProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/get-retention-alerts.interface";
import type { UpdateRetentionAlertProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/update-retention-alert.interface";

export class RetentionAlertsValidatorsImpl implements RetentionAlertsValidators {
    public constructor(
        public readonly changeRetentionAlertStatusValidator: EntityValidator<ChangeRetentionAlertStatusProps>,
        public readonly getCountAlertsValidator: EntityValidator<GetCountAlertsProps>,
        public readonly getRetentionAlertsValidator: EntityValidator<GetRetentionAlertsProps>,
        public readonly updateRetentionAlertValidator: EntityValidator<UpdateRetentionAlertProps>,
    ) {}
}
