import { ActiveStudentProjection } from "../projections/ActiveStudentProjection";

export abstract class StudentProjectionRepository {
    public abstract getActiveStudentProfile(studentId: string): Promise<ActiveStudentProjection>;
}
