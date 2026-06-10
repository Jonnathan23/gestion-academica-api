import type { AttendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/Attendance.interface";

export class StudentInClassProjection {
    constructor(
        public readonly sessionId: string,
        public readonly studentId: string,
        public readonly fullName: string,
        public readonly sessionStatus: AttendanceSessionStatus,
        public readonly entryTime: Date,
    ) {}
}
