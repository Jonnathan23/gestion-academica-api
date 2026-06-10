export class StudentClassTrackProjection {
    constructor(
        public readonly studentId: string,
        public readonly identificationCard: string,
        public readonly fullName: string,
    ) {}
}
