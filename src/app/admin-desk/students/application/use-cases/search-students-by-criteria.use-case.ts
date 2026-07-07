import type { PaginatedResult } from "@/core/interfaces/paginated-result.interface";
import { SearchStudentsByCriteriaDto } from "@/app/admin-desk/students/domain/dtos/search-students-by-criteria.dto";
import { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";
import { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";

export class SearchStudentsByCriteria {
    public constructor(private readonly studentRepository: StudentRepository) {}

    public async execute(dto: SearchStudentsByCriteriaDto): Promise<PaginatedResult<StudentEntity>> {
        return await this.studentRepository.searchByCriteria(dto);
    }
}
