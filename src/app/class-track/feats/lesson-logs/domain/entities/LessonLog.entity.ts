export class LessonLogEntity {
    constructor(
        public id: string,
        public attendanceSessionId: string,
        public lessonNumber: string,
        public oralPracticeScore: number | null,
        public isCompleted: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
