import type { UpdateStudentLevelDto } from "@/app/AdminDesk/contracts/domain/dtos";
import type { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";
import type { StudentLevelRepository } from "@/app/AdminDesk/contracts/domain/repositories/contract.repository";

export interface UpdateContractStatusUseCase {
    execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]>;
}

export class UpdateStudentLevel implements UpdateContractStatusUseCase {
    constructor(
        private readonly repository: StudentLevelRepository
    ) { }

    execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]> {
        return this.repository.updateStudentLevel(dto);
    }
}
