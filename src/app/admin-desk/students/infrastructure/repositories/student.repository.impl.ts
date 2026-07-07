import type { StudentDataSource } from "@/app/admin-desk/students/domain/datasource/student.datasource";
import type {
    RegisterStudentDto,
    UpdateStudentDto,
    ChangeContractStatusDto,
    SearchStudentsByCriteriaDto,
    StudentEntity,
} from "@/app/admin-desk/students/domain";
import type { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";
import type { PaginatedResult } from "@/core/interfaces/PaginatedResult.interface";

export class StudentRepositoryImpl implements StudentRepository {
    public constructor(private readonly datasource: StudentDataSource) {}

    public async register(dto: RegisterStudentDto): Promise<StudentEntity> {
        return this.datasource.register(dto);
    }

    public async search(query: string): Promise<StudentEntity[]> {
        return this.datasource.search(query);
    }

    public async searchByCriteria(dto: SearchStudentsByCriteriaDto): Promise<PaginatedResult<StudentEntity>> {
        return this.datasource.searchByCriteria(dto);
    }

    public getAllStudents(): Promise<StudentEntity[]> {
        return this.datasource.getAllStudents();
    }

    public update(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
        return this.datasource.update(id, dto);
    }

    public changeContractStatus(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity> {
        return this.datasource.changeContractStatus(id, dto);
    }

    public toggleGraduated(id: string): Promise<StudentEntity> {
        return this.datasource.toggleGraduated(id);
    }

    public deactivate(id: string): Promise<StudentEntity> {
        return this.datasource.deactivate(id);
    }
}
