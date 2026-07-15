import type { StudentInClassProjection } from "@/app/class-track/core/students/domain/projections/StudentInClass.projection";

export class DashboardSummaryProjection {
    public constructor(
        public readonly studentsInsideCount: number,
        public readonly pendingCheckoutsCount: number,
        public readonly activeAlertsCount: number,
        public readonly activeContractsCount: number,
        public readonly studentsInClass: StudentInClassProjection[],
    ) {}
}
