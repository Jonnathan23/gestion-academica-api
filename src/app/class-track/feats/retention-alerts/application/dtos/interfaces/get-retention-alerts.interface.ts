import type { RetentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";
import type { StudentContractStatus } from "@/data/models/admin-desk/student.model";

export interface GetRetentionAlertsProps {
    status?: RetentionAlertStatus;
    page: string | number;
    limit?: string | number;
    studentParameter?: string;
    contractStatus?: StudentContractStatus;
    daysAbsent?: string | number;
    isJustified?: boolean | string;
}
