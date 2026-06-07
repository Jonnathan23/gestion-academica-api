import type { ActiveStudentProjection } from "@/app/class-track/core/interfaces/StudentProjection.interface";

export abstract class StudentProjectionDatasource {
    public abstract getActiveStudentProfile(studentId: string): Promise<ActiveStudentProjection>;
    public abstract getActiveContractsCount(): Promise<number>;
}
