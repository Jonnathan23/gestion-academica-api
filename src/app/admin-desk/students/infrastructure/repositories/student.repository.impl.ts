import type { StudentDataSource } from "@/app/admin-desk/students/domain/datasource/student.datasource";
import type { RegisterStudentDto, UpdateStudentDto, ChangeContractStatusDto, StudentEntity } from "@/app/admin-desk/students/domain";
import type { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";

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

    getAllStudents(): Promise<StudentEntity[]> {
        return this.datasource.getAllStudents();
    }

    update(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
        return this.datasource.update(id, dto);
    }

    changeContractStatus(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity> {
        return this.datasource.changeContractStatus(id, dto);
    }

    toggleGraduated(id: string): Promise<StudentEntity> {
        return this.datasource.toggleGraduated(id);
    }

    deactivate(id: string): Promise<StudentEntity> {
        return this.datasource.deactivate(id);
    }
}
