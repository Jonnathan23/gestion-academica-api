export class ApproveAttendanceSessionDto {
    private constructor(
        public readonly sessionId: string,
        public readonly teacherId: string,
    ) {}

    public static create(object: { [key: string]: any }): [string?, ApproveAttendanceSessionDto?] {
        const { sessionId, teacherId } = object;
        //TODO: agregar validaciones de UUID
        if (!sessionId) return ["Missing sessionId"];
        if (!teacherId) return ["Missing teacherId"];

        return [undefined, new ApproveAttendanceSessionDto(sessionId, teacherId)];
    }
}
