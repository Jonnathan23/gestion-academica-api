import { Validators } from "@/core/utils/validators";

export class ApproveAttendanceSessionDto {
    private constructor(
        public readonly sessionId: string,
        public readonly teacherId: string,
    ) {}

    public static create(object: { [key: string]: any }, teacherId: string): [string?, ApproveAttendanceSessionDto?] {
        const { sessionId } = object;

        if (!sessionId) return ["Invalid session"];
        if (!Validators.isUUID(sessionId)) return ["Invalid session"];

        if (!teacherId) return ["Missing teacher"];
        if (!Validators.isUUID(teacherId)) return ["Invalid teacher"];

        return [undefined, new ApproveAttendanceSessionDto(sessionId, teacherId)];
    }
}
