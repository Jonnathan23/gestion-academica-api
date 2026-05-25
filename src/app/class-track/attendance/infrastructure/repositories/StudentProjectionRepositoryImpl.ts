import { StudentProjectionRepository } from "../../domain/repositories/StudentProjectionRepository";
import { StudentProjectionDatasource } from "../../domain/datasource/StudentProjectionDatasource";
import { ActiveStudentProjection } from "../../domain/projections/ActiveStudentProjection";

export class StudentProjectionRepositoryImpl implements StudentProjectionRepository {
    constructor(private readonly datasource: StudentProjectionDatasource) {}

    public async getActiveStudentProfile(studentId: string): Promise<ActiveStudentProjection> {
        return this.datasource.getActiveStudentProfile(studentId);
    }
}
