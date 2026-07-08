import type { RegisterStudentDto } from "@/app/admin-desk/students/application/dtos/register-student.dto";
import type { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";
import type { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";

export interface RegisterStudentUseCase {
    execute(dto: RegisterStudentDto): Promise<StudentEntity>;
}

export class RegisterStudent implements RegisterStudentUseCase {
    public constructor(private readonly repository: StudentRepository) {}

    public execute(dto: RegisterStudentDto): Promise<StudentEntity> {
        return this.repository.register(dto);
    }
}
