import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { ChangeRetentionAlertStatusProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/change-retention-alert-status.interface";
import type { GetCountAlertsProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/get-count-alerts.interface";
import type { GetRetentionAlertsProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/get-retention-alerts.interface";
import type { UpdateRetentionAlertProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/update-retention-alert.interface";

export interface RetentionAlertsValidators {
    changeRetentionAlertStatusValidator: EntityValidator<ChangeRetentionAlertStatusProps>;
    getCountAlertsValidator: EntityValidator<GetCountAlertsProps>;
    getRetentionAlertsValidator: EntityValidator<GetRetentionAlertsProps>;
    updateRetentionAlertValidator: EntityValidator<UpdateRetentionAlertProps>;
}
