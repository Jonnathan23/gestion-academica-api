import type { PaginatedResult } from "@/core/interfaces/paginated-result.interface";
import { RegisterStudentDto } from "@/app/admin-desk/students/application/dtos/register-student.dto";
import { UpdateStudentDto } from "@/app/admin-desk/students/application/dtos/update-student.dto";
import { ChangeContractStatusDto } from "@/app/admin-desk/students/application/dtos/change-contract-status.dto";
import { SearchStudentsByCriteriaDto } from "@/app/admin-desk/students/application/dtos/search-students-by-criteria.dto";
import { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";

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
