import type { RegisterStudentDto } from "./dtos/RegisterStudent.dto";
import type { StudentEntity } from "./entities/Student.entity";

export abstract class StudentRepository {
    abstract register(dto: RegisterStudentDto): Promise<StudentEntity>;
    abstract search(query: string): Promise<StudentEntity[]>;
}
