import type { RetentionAlertStatus } from "@/data/models/class-track/RetentionAlert.model";

export class RetentionAlertEntity {
    constructor(
        public readonly reAlId: string,
        public readonly reAlStudentId: string,
        public readonly reAlUserId: string | null,
        public readonly reAlContactDate: Date | null,
        public readonly reAlHasResponded: boolean,
        public readonly reAlDaysAbsent: number,
        public readonly reAlIsJustified: boolean,
        public readonly reAlJustificationReason: string | null,
        public readonly reAlReturnDeadline: Date | null,
        public readonly reAlObservations: string,
        public readonly reAlStatus: RetentionAlertStatus,
        public readonly reAlCreatedAt: Date,
    ) {}
}
