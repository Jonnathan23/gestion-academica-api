import type { StudentLevelDetailsProjection } from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";

export interface GetStudentContractsUseCase {
    execute(studentId: string): Promise<StudentLevelDetailsProjection[]>;
}

export class GetStudentContracts implements GetStudentContractsUseCase {
    constructor(private readonly repository: StudentLevelRepository) {}

    execute(studentId: string): Promise<StudentLevelDetailsProjection[]> {
        return this.repository.getStudentContracts(studentId);
    }
}
