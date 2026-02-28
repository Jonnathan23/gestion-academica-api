import type { ChangeContractStatusDto, StudentEntity, StudentRepository } from "@/app/AdminDesk/students/domain";

export interface ChangeContractStatusUseCase {
    execute(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity>;
}

export class ChangeContractStatus implements ChangeContractStatusUseCase {

    constructor(
        private readonly repository: StudentRepository
    ) { }

    execute(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity> {
        return this.repository.changeContractStatus(id, dto);
    }
}
