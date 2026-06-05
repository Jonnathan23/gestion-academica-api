import type { StudentProjectionDatasource } from "@/app/class-track/feats/attendance/domain/datasource/StudentProjection.datasource";
import type { StudentProjectionRepository } from "@/app/class-track/feats/attendance/domain/repositories/StudentProjection.repository";
import type { ActiveStudentProjection } from "@/app/class-track/core/interfaces/StudentProjection.interface";

export class StudentProjectionRepositoryImpl implements StudentProjectionRepository {
    constructor(private readonly datasource: StudentProjectionDatasource) {}

    public async getActiveStudentProfile(studentId: string): Promise<ActiveStudentProjection> {
        return this.datasource.getActiveStudentProfile(studentId);
    }

    public async getActiveContractsCount(): Promise<number> {
        return this.datasource.getActiveContractsCount();
    }
}
