import type { StudentContractStatus, StudentProgressCategory } from "@/core/interfaces/students.interface";

export class StudentEntity {
    public constructor(
        public readonly id: string,
        public readonly identificationCard: string,
        public readonly fullName: string,
        public readonly phoneNumber: string,
        public readonly email: string,
        public readonly dateOfBirth: Date,
        public readonly nationality: string,
        public readonly certificateType: string,
        public readonly startDate: Date,
        public readonly isGraduated: boolean,
        public readonly contractStatus: StudentContractStatus,
        public readonly progressCategory: StudentProgressCategory,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
