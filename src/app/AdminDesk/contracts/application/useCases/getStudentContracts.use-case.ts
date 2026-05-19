import type { StudentLevelDetailsProjection } from "@/app/AdminDesk/contracts/domain/projections/ContractDetails.projection";
import type { StudentLevelRepository } from "@/app/AdminDesk/contracts/domain/repositories/contract.repository";

export interface GetStudentContractsUseCase {
    execute(studentId: string): Promise<StudentLevelDetailsProjection[]>;
}

export class GetStudentContracts implements GetStudentContractsUseCase {
    constructor(
        private readonly repository: StudentLevelRepository
    ) { }

    execute(studentId: string): Promise<StudentLevelDetailsProjection[]> {
        return this.repository.getStudentContracts(studentId);
    }
}
