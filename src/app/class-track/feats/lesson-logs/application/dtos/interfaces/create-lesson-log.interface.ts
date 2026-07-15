export interface LessonItemProps {
    lessonNumber: number;
    oralPracticeScore: number | null;
    isCompleted: boolean;
}

export interface CreateLessonLogsProps {
    attendanceSessionId: string;
    lessonsStudied: LessonItemProps[];
}
