export class AcademicObservationEntity {
    constructor(
        public readonly acObId: string,
        public readonly acObStudentId: string,
        public readonly acObTeacherId: string,
        public readonly acObObservation: string,
        public readonly acObDeadline: Date | null,
        public readonly acObCreatedAt: Date,
        public readonly acObUpdatedAt: Date,
    ) {}
}
