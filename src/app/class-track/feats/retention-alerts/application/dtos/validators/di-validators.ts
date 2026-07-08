import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { changeRetentionAlertStatusSchema } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/schemas/valibot/change-retention-alert-status.schema";
import { getCountAlertsSchema } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/schemas/valibot/get-count-alerts.schema";
import { getRetentionAlertsSchema } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/schemas/valibot/get-retention-alerts.schema";
import { updateRetentionAlertSchema } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/schemas/valibot/update-retention-alert.schema";
import { RetentionAlertsValidatorsImpl } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/validator";

import type { ChangeRetentionAlertStatusProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/change-retention-alert-status.interface";
import type { GetCountAlertsProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/get-count-alerts.interface";
import type { GetRetentionAlertsProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/get-retention-alerts.interface";
import type { UpdateRetentionAlertProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/update-retention-alert.interface";

const changeRetentionAlertStatusValidator = createValidator<ChangeRetentionAlertStatusProps>(changeRetentionAlertStatusSchema);
const getCountAlertsValidator = createValidator<GetCountAlertsProps>(getCountAlertsSchema);
const getRetentionAlertsValidator = createValidator<GetRetentionAlertsProps>(getRetentionAlertsSchema);
const updateRetentionAlertValidator = createValidator<UpdateRetentionAlertProps>(updateRetentionAlertSchema);

export const retentionAlertsValidators = new RetentionAlertsValidatorsImpl(
    changeRetentionAlertStatusValidator,
    getCountAlertsValidator,
    getRetentionAlertsValidator,
    updateRetentionAlertValidator,
);
