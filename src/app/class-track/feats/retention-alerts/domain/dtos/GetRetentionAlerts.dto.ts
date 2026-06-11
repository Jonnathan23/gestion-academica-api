import {
    retentionAlertStatus,
    type RetentionAlertStatus,
} from "@/app/class-track/feats/retention-alerts/domain/interfaces/RetentionAlert.interface";

export class GetRetentionAlertsDto {
    private constructor(
        public readonly status?: RetentionAlertStatus,
        public readonly page?: number,
        public readonly limit?: number,
    ) {}

    public static create(props: { [key: string]: any }): [string?, GetRetentionAlertsDto?] {
        const { status, page, limit } = props;

        if (status) {
            const validStatuses = Object.values(retentionAlertStatus);
            if (!validStatuses.includes(status as RetentionAlertStatus)) {
                return [`Invalid status value`];
            }
        }

        let parsedPage = page ? parseInt(page) : 1;
        let parsedLimit = limit ? parseInt(limit) : 10;

        if (isNaN(parsedPage) || parsedPage <= 0) parsedPage = 1;
        if (isNaN(parsedLimit) || parsedLimit <= 0) parsedLimit = 10;

        return [undefined, new GetRetentionAlertsDto(status as RetentionAlertStatus, parsedPage, parsedLimit)];
    }
}
