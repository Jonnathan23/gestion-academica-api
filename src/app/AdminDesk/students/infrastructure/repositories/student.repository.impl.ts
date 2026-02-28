import type { StudentDataSource } from "@/app/AdminDesk/students/domain/datasource/student.datasource";
import type { RegisterStudentDto, UpdateStudentDto, ChangeContractStatusDto, StudentEntity } from "@/app/AdminDesk/students/domain";
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
