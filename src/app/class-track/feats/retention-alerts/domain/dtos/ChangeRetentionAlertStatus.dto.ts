import {
    retentionAlertStatus,
    type RetentionAlertStatus,
} from "@/app/class-track/feats/retention-alerts/domain/interfaces/RetentionAlert.interface";

export class ChangeRetentionAlertStatusDto {
    private constructor(public readonly status: RetentionAlertStatus) {}

    public static create(props: { [key: string]: any }): [string?, ChangeRetentionAlertStatusDto?] {
        const { status } = props;

        if (!status) {
            return ["Status is required"];
        }

        const validStatuses = Object.values(retentionAlertStatus);
        if (!validStatuses.includes(status as RetentionAlertStatus)) {
            return [`Invalid status value`];
        }

        return [undefined, new ChangeRetentionAlertStatusDto(status as RetentionAlertStatus)];
    }
}
