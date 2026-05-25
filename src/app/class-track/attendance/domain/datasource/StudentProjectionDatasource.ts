import { ActiveStudentProjection } from "../projections/ActiveStudentProjection";

export abstract class StudentProjectionDatasource {
    public abstract getActiveStudentProfile(studentId: string): Promise<ActiveStudentProjection>;
}
