export interface UpdateRetentionAlertProps {
    hasResponded: boolean;
    isJustified: boolean;
    observations: string;
    contactDate?: string | Date | number;
    justificationReason?: string;
    returnDeadline?: string | Date | number;
}
