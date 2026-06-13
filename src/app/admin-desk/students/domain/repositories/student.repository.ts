import type {
    RegisterStudentDto,
    UpdateStudentDto,
    ChangeContractStatusDto,
    SearchStudentsByCriteriaDto,
    StudentEntity,
} from "@/app/admin-desk/students/domain";

import type { PaginatedResult } from "@/core/interfaces/PaginatedResult.interface";

export abstract class StudentRepository {
    abstract register(dto: RegisterStudentDto): Promise<StudentEntity>;
    abstract search(query: string): Promise<StudentEntity[]>;
    abstract searchByCriteria(dto: SearchStudentsByCriteriaDto): Promise<PaginatedResult<StudentEntity>>;
    abstract getAllStudents(): Promise<StudentEntity[]>;
    abstract update(id: string, dto: UpdateStudentDto): Promise<StudentEntity>;
    abstract changeContractStatus(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity>;
    abstract toggleGraduated(id: string): Promise<StudentEntity>;
    abstract deactivate(id: string): Promise<StudentEntity>;
}
