import type { StudentModuleStatus } from "@/core/interfaces/Contracts.interface";

export class LevelActiveForStudentProjection {
    constructor(
        public readonly levelId: string,
        public readonly statusLevel: StudentModuleStatus,
        public readonly contractFreezeCount: number,
        public readonly contractReactivationCount: number,
    ) {}
}
