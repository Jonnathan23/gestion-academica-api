import {
    retentionAlertStatus,
    type RetentionAlertStatus,
} from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";

export class GetCountAlertsDto {
    private constructor(public readonly status: RetentionAlertStatus) {}

    public static create(props: { [key: string]: any }): [string?, GetCountAlertsDto?] {
        const { status } = props;

        if (!status) {
            return ["status is required"];
        }

        const validStatuses = Object.values(retentionAlertStatus);

        if (!validStatuses.includes(status as RetentionAlertStatus)) {
            return [`Invalid status value`];
        }

        return [undefined, new GetCountAlertsDto(status as RetentionAlertStatus)];
    }
}
