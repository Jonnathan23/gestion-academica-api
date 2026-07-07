export class StartAttendanceSessionDto {
    private constructor(
        public readonly studentId: string,
        public readonly entryTime: Date,
    ) {}

    public static create(object: { [key: string]: unknown }): [string?, StartAttendanceSessionDto?] {
        const { studentId, entryTime } = object as { studentId?: string; entryTime?: unknown };

        if (!studentId) return ["Missing student"];

        if (!entryTime) {
            return ["Missing entryTime"];
        }

        let validEntryTime: Date;

        if (entryTime instanceof Date) {
            validEntryTime = entryTime;
        } else if (typeof entryTime === "string") {
            validEntryTime = new Date(entryTime);
            if (isNaN(validEntryTime.getTime())) {
                return ["Invalid entryTime format. Expected a valid date string."];
            }
        } else {
            return ["Invalid entryTime type. Expected a Date object or an ISO date string."];
        }

        return [undefined, new StartAttendanceSessionDto(studentId, validEntryTime)];
    }
}
