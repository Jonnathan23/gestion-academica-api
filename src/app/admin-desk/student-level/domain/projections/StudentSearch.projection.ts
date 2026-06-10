export class StudentSearchProjection {
    constructor(
        public readonly id: string,
        public readonly identificationCard: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly totalEnrolledLevels: number,
    ) {}
}
