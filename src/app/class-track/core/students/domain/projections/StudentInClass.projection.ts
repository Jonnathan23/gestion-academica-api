import type { AttendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";

export class StudentInClassProjection {
    public constructor(
        public readonly sessionId: string,
        public readonly studentId: string,
        public readonly fullName: string,
        public readonly sessionStatus: AttendanceSessionStatus,
        public readonly entryTime: Date,
    ) {}
}
