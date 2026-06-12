import {
    retentionAlertStatus,
    type RetentionAlertStatus,
} from "@/app/class-track/feats/retention-alerts/domain/interfaces/RetentionAlert.interface";
import { studentContractStatus, type StudentContractStatus } from "@/data/models/admin-desk/Student.model";

export class GetRetentionAlertsDto {
    private constructor(
        public readonly status?: RetentionAlertStatus,
        public readonly page?: number,
        public readonly limit?: number,
        public readonly studentParameter?: string,
        public readonly contractStatus?: StudentContractStatus,
        public readonly daysAbsent?: number,
        public readonly isJustified?: boolean,
    ) {}

    public static create(props: { [key: string]: any }): [string?, GetRetentionAlertsDto?] {
        const { status, page, limit, studentParameter, contractStatus, daysAbsent, isJustified } = props;

        if (status) {
            const validStatuses = Object.values(retentionAlertStatus);
            if (!validStatuses.includes(status as RetentionAlertStatus)) {
                return [`Invalid status value`];
            }
        }

        if (contractStatus) {
            const validContractStatuses = Object.values(studentContractStatus);
            if (!validContractStatuses.includes(contractStatus as StudentContractStatus)) {
                return [`Invalid contractStatus value`];
            }
        }

        let parsedPage = page ? parseInt(page) : 1;
        let parsedLimit = limit ? parseInt(limit) : 10;
        let parsedDaysAbsent = daysAbsent !== undefined ? parseInt(daysAbsent) : undefined;
        let parsedIsJustified = isJustified !== undefined ? isJustified === "true" || isJustified === true : undefined;

        if (isNaN(parsedPage) || parsedPage <= 0) parsedPage = 1;
        if (isNaN(parsedLimit) || parsedLimit <= 0) parsedLimit = 10;
        if (daysAbsent !== undefined && isNaN(parsedDaysAbsent as number)) {
            return [`Invalid daysAbsent value`];
        }

        return [
            undefined,
            new GetRetentionAlertsDto(
                status as RetentionAlertStatus,
                parsedPage,
                parsedLimit,
                studentParameter,
                contractStatus as StudentContractStatus,
                parsedDaysAbsent,
                parsedIsJustified,
            ),
        ];
    }
}
