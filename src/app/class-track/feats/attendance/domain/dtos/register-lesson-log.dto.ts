export class RegisterLessonLogDto {
    private constructor(
        public readonly attendanceSessionId: string,
        public readonly lessonNumber: string,
        public readonly notes: string,
        public readonly activeModule: string,
    ) {}

    public static create(object: { [key: string]: any }): [string?, RegisterLessonLogDto?] {
        const { attendanceSessionId, lessonNumber, notes, activeModule } = object;

        if (!attendanceSessionId) return ["Missing attendanceSessionId"];
        if (!lessonNumber) return ["Missing lessonNumber"];
        if (!notes) return ["Missing notes"];
        if (!activeModule) return ["Missing activeModule"];

        return [undefined, new RegisterLessonLogDto(attendanceSessionId, lessonNumber, notes, activeModule)];
    }
}
