import type { StudentInClassProjection } from "@/app/class-track/feats/attendance/domain/projections/StudentInClass.projection";

export class DashboardSummaryProjection {
    constructor(
        public readonly studentsInsideCount: number,
        public readonly pendingCheckoutsCount: number,
        public readonly activeAlertsCount: number,
        public readonly activeContractsCount: number,
        public readonly studentsInClass: StudentInClassProjection[],
    ) {}
}
