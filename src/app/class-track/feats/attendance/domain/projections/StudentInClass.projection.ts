import type { StudentContractStatus } from "@/core/interfaces/Students.interface";

export class StudentInClassProjection {
    constructor(
        public readonly sessionId: string,
        public readonly studentId: string,
        public readonly fullName: string,
        public readonly contractStatus: StudentContractStatus,
        public readonly entryTime: Date,
    ) {}
}
