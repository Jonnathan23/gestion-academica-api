import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/student-level.repository";

export interface GetStudentContractsUseCase {
    execute(studentId: string): Promise<StudentLevelDetailsProjection[]>;
}

export class GetStudentContracts implements GetStudentContractsUseCase {
    public constructor(private readonly repository: StudentLevelRepository) {}

    public execute(studentId: string): Promise<StudentLevelDetailsProjection[]> {
        return this.repository.getStudentContracts(studentId);
    }
}
