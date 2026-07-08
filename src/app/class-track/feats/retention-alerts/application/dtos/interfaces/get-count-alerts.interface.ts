import type { RetentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";

export interface GetCountAlertsProps {
    status: RetentionAlertStatus;
}
