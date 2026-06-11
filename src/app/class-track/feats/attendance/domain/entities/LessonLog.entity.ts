export class LessonLogEntity {
    constructor(
        public readonly leLoId: string,
        public readonly leLoAttendanceSessionId: string,
        public readonly leLoLessonNumber: string,
        public readonly leLoNotes: string,
        public readonly leLoCreatedAt: Date,
    ) {}
}
