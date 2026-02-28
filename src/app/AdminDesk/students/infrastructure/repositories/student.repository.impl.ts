import type { StudentDataSource } from "@/app/AdminDesk/students/domain/datasource/student.datasource";
import type { RegisterStudentDto } from "@/app/AdminDesk/students/domain/dtos/RegisterStudent.dto";
import type { StudentEntity } from "@/app/AdminDesk/students/domain/entities/Student.entity";
import type { StudentRepository } from "@/app/AdminDesk/students/domain/repositories/student.repository";

export class StudentRepositoryImpl implements StudentRepository {

    constructor(
        private readonly datasource: StudentDataSource
    ) { }

    register(dto: RegisterStudentDto): Promise<StudentEntity> {
        return this.datasource.register(dto);
    }

    search(query: string): Promise<StudentEntity[]> {
        return this.datasource.search(query);
    }
}
