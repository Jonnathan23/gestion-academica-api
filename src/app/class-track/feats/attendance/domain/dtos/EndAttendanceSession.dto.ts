export class EndAttendanceSessionDto {
    private constructor(
        public readonly sessionId: string,
        public readonly exitTime: Date,
    ) {}

    public static create(object: { [key: string]: any }): [string?, EndAttendanceSessionDto?] {
        const { sessionId, exitTime } = object;

        if (!sessionId) return ["Missing sessionId"];

        let validExitTime = exitTime;
        if (!(exitTime instanceof Date) || isNaN(exitTime.getTime())) {
            validExitTime = new Date(exitTime);
            if (isNaN(validExitTime.getTime())) {
                return ["Invalid exitTime. Must be a valid Date"];
            }
        }

        return [undefined, new EndAttendanceSessionDto(sessionId, validExitTime)];
    }
}
