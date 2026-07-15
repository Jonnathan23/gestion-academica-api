import { ChangeContractStatusDto } from "@/app/admin-desk/students/application/dtos/change-contract-status.dto";
import { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";
import { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";

export interface ChangeContractStatusUseCase {
    execute(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity>;
}

export class ChangeContractStatus implements ChangeContractStatusUseCase {
    public constructor(private readonly repository: StudentRepository) {}

    public execute(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity> {
        return this.repository.changeContractStatus(id, dto);
    }
}
