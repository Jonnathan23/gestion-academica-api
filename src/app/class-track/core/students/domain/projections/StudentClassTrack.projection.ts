export class StudentClassTrackProjection {
    public constructor(
        public readonly studentId: string,
        public readonly identificationCard: string,
        public readonly fullName: string,
    ) {}
}
