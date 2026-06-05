import type { AttendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/attendance.interface";

export class AttendanceSessionEntity {
    constructor(
        public readonly atSeId: string,
        public readonly atSeStudentId: string,
        public readonly atSeTeacherId: string | null,
        public readonly atSeSessionDate: Date,
        public readonly atSeEntryTime: Date,
        public readonly atSeExitTime: Date | null,
        public readonly atSeTotalMinutes: number | null,
        public readonly atSeStatus: AttendanceSessionStatus,
    ) {}
}
