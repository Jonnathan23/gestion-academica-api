import type { RegisterStudentDto, UpdateStudentDto, ChangeContractStatusDto, StudentEntity } from "@/app/AdminDesk/students/domain";



export abstract class StudentDataSource {
    abstract register(dto: RegisterStudentDto): Promise<StudentEntity>;
    abstract search(query: string): Promise<StudentEntity[]>;
    abstract getAllStudents(): Promise<StudentEntity[]>;
    abstract update(id: string, dto: UpdateStudentDto): Promise<StudentEntity>;
    abstract changeContractStatus(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity>;
    abstract toggleGraduated(id: string): Promise<StudentEntity>;
    abstract deactivate(id: string): Promise<StudentEntity>;
}
