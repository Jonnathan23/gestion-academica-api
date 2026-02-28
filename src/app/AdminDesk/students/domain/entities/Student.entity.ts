import type { StudentContractStatus, StudentProgressCategory } from "@/app/AdminDesk/students/domain/interfaces/Students.interface";

export class StudentEntity {
    constructor(
        public readonly id: string,
        public readonly identificationCard: string,
        public readonly fullName: string,
        public readonly phoneNumber: string,
        public readonly startDate: Date,
        public readonly isGraduated: boolean,
        public readonly contractStatus: StudentContractStatus,
        public readonly progressCategory: StudentProgressCategory,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }
}
