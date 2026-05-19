import type { StudentEntity } from "@/app/admin-desk/students/domain/entities/Student.entity";
import type { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";



interface GetAllStudentsUseCase {
    execute(): Promise<StudentEntity[]>;
}

export class GetAllStudents implements GetAllStudentsUseCase {
    constructor(
        private readonly studentRepository: StudentRepository
    ) { }

    execute(): Promise<StudentEntity[]> {
        return this.studentRepository.getAllStudents();
    }
}