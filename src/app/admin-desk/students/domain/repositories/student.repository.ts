import type {
    RegisterStudentDto,
    UpdateStudentDto,
    ChangeContractStatusDto,
    SearchStudentsByCriteriaDto,
    StudentEntity,
} from "@/app/admin-desk/students/domain";

import type { PaginatedResult } from "@/core/interfaces/PaginatedResult.interface";

export abstract class StudentRepository {
    public abstract register(dto: RegisterStudentDto): Promise<StudentEntity>;
    public abstract search(query: string): Promise<StudentEntity[]>;
    public abstract searchByCriteria(dto: SearchStudentsByCriteriaDto): Promise<PaginatedResult<StudentEntity>>;
    public abstract getAllStudents(): Promise<StudentEntity[]>;
    public abstract update(id: string, dto: UpdateStudentDto): Promise<StudentEntity>;
    public abstract changeContractStatus(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity>;
    public abstract toggleGraduated(id: string): Promise<StudentEntity>;
    public abstract deactivate(id: string): Promise<StudentEntity>;
}
