import type { StudentModuleStatus } from "@/core/interfaces/Contracts.interface";

export class StudentLevelEntity {
    constructor(
        public readonly id: string,
        public readonly studentId: string,
        public readonly moduleId: string,
        public readonly sellerId: string,
        public readonly status: StudentModuleStatus,
        public readonly freezeCount: number,
        public readonly reactivateCount: number,
        public readonly purchaseDate: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
