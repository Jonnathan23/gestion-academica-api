import type { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";
import type { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";

interface GetAllStudentsUseCase {
    execute(): Promise<StudentEntity[]>;
}

export class GetAllStudents implements GetAllStudentsUseCase {
    public constructor(private readonly studentRepository: StudentRepository) {}

    public execute(): Promise<StudentEntity[]> {
        return this.studentRepository.getAllStudents();
    }
}
