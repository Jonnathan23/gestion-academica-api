import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { GetRetentionAlertsProps } from "@/app/class-track/feats/retention-alerts/application/dtos/interfaces/get-retention-alerts.interface";
import type { RetentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";
import type { StudentContractStatus } from "@/data/models/admin-desk/student.model";

export class GetRetentionAlertsDto {
    private constructor(
        public readonly status: RetentionAlertStatus | undefined,
        public readonly page: number,
        public readonly limit?: number,
        public readonly studentParameter?: string,
        public readonly contractStatus?: StudentContractStatus,
        public readonly daysAbsent?: number,
        public readonly isJustified?: boolean,
    ) {}

    public static create(props: Record<string, unknown>, validator: EntityValidator<GetRetentionAlertsProps>): GetRetentionAlertsDto {
        const validatedData = validator.validate(props);

        const parsedPage = typeof validatedData.page === "string" ? parseInt(validatedData.page) : validatedData.page;

        let parsedLimit: number | undefined;

        if (validatedData.limit !== undefined) {
            parsedLimit = typeof validatedData.limit === "string" ? parseInt(validatedData.limit) : validatedData.limit;
        } else {
            parsedLimit = 10;
        }

        let parsedDaysAbsent: number | undefined;

        if (validatedData.daysAbsent !== undefined) {
            parsedDaysAbsent = typeof validatedData.daysAbsent === "string" ? parseInt(validatedData.daysAbsent) : validatedData.daysAbsent;
        }

        let parsedIsJustified: boolean | undefined;

        if (validatedData.isJustified !== undefined) {
            parsedIsJustified = validatedData.isJustified === "true" || validatedData.isJustified === true;
        }

        return new GetRetentionAlertsDto(
            validatedData.status,
            parsedPage,
            parsedLimit,
            validatedData.studentParameter,
            validatedData.contractStatus,
            parsedDaysAbsent,
            parsedIsJustified,
        );
    }
}
