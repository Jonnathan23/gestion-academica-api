import type { RegisterStudentDto, StudentEntity } from "@/app/AdminDesk/students/domain";



export abstract class StudentDataSource {
    abstract register(dto: RegisterStudentDto): Promise<StudentEntity>;
    abstract search(query: string): Promise<StudentEntity[]>;
}
