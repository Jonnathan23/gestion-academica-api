export class StartAttendanceSessionDto {
    private constructor(
        public readonly studentId: string,
        public readonly entryTime: Date,
    ) {}

    public static create(object: { [key: string]: any }): [string?, StartAttendanceSessionDto?] {
        const { studentId, entryTime } = object;

        if (!studentId) return ["Missing studentId"];

        let validEntryTime = entryTime;
        if (!(entryTime instanceof Date) || isNaN(entryTime.getTime())) {
            validEntryTime = new Date(entryTime);
            if (isNaN(validEntryTime.getTime())) {
                return ["Invalid entryTime. Must be a valid Date"];
            }
        }

        return [undefined, new StartAttendanceSessionDto(studentId, validEntryTime)];
    }
}
