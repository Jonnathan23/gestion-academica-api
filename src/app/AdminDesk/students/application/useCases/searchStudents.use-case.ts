import type { StudentEntity } from "@/app/AdminDesk/students/domain/entities/Student.entity";
import type { StudentRepository } from "@/app/AdminDesk/students/domain/repositories/student.repository";

export interface SearchStudentsUseCase {
    execute(query: string): Promise<StudentEntity[]>;
}

export class SearchStudents implements SearchStudentsUseCase {

    constructor(
        private readonly repository: StudentRepository
    ) { }

    execute(query: string): Promise<StudentEntity[]> {
        return this.repository.search(query);
    }
}
