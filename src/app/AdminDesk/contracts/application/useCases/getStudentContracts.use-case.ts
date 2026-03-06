import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";
import type { StudentLevelRepository } from "@/app/AdminDesk/contracts/domain/repositories/contract.repository";

export interface GetStudentContractsUseCase {
    execute(studentId: string): Promise<StudentLevelEntity[]>;
}

export class GetStudentContracts implements GetStudentContractsUseCase {
    constructor(
        private readonly repository: StudentLevelRepository
    ) { }

    execute(studentId: string): Promise<StudentLevelEntity[]> {
        return this.repository.getStudentContracts(studentId);
    }
}
