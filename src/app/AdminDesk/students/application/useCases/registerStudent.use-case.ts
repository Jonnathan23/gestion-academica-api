import type { RegisterStudentDto } from "@/app/AdminDesk/students/domain/dtos/RegisterStudent.dto";
import type { StudentEntity } from "@/app/AdminDesk/students/domain/entities/Student.entity";
import type { StudentRepository } from "@/app/AdminDesk/students/domain/repositories/student.repository";

export interface RegisterStudentUseCase {
    execute(dto: RegisterStudentDto): Promise<StudentEntity>;
}

export class RegisterStudent implements RegisterStudentUseCase {

    constructor(
        private readonly repository: StudentRepository
    ) { }

    execute(dto: RegisterStudentDto): Promise<StudentEntity> {
        return this.repository.register(dto);
    }
}
