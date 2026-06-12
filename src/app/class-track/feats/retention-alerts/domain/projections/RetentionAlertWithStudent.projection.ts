import type { RetentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/RetentionAlert.interface";

export interface BasicStudentInfo {
    id: string;
    fullName: string;
    identificationCard: string;
    phoneNumber: string;
    contractStatus: string;
}

export class RetentionAlertWithStudentProjection {
    constructor(
        public readonly id: string,
        public readonly contactDate: Date | null,
        public readonly hasResponded: boolean,
        public readonly daysAbsent: number,
        public readonly isJustified: boolean,
        public readonly justificationReason: string | null,
        public readonly returnDeadline: Date | null,
        public readonly observations: string,
        public readonly status: RetentionAlertStatus,
        public readonly student: BasicStudentInfo,
        public readonly createdAt: Date,
    ) {}
}
