import type { ChangeContractStatusDto, StudentEntity, StudentRepository } from "@/app/admin-desk/students/domain";

export interface ChangeContractStatusUseCase {
    execute(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity>;
}

export class ChangeContractStatus implements ChangeContractStatusUseCase {
    public constructor(private readonly repository: StudentRepository) {}

    public execute(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity> {
        return this.repository.changeContractStatus(id, dto);
    }
}
