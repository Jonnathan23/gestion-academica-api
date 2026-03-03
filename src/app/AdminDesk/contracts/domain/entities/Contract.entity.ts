import type { StudentModuleStatus } from "@/app/AdminDesk/contracts/domain/interfaces/Contracts.interface";

export class StudentLevelEntity {
    constructor(
        public readonly id: string,
        public readonly studentId: string,
        public readonly moduleId: string,
        public readonly sellerId: string,
        public readonly status: StudentModuleStatus,
        public readonly purchaseDate: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }
}
