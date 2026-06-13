import type { SearchStudentsByCriteriaDto, StudentEntity, StudentRepository } from "@/app/admin-desk/students/domain";
import type { PaginatedResult } from "@/core/interfaces/PaginatedResult.interface";

export class SearchStudentsByCriteria {
    constructor(private readonly studentRepository: StudentRepository) {}

    public async execute(dto: SearchStudentsByCriteriaDto): Promise<PaginatedResult<StudentEntity>> {
        return await this.studentRepository.searchByCriteria(dto);
    }
}
