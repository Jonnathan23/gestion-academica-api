import type { InfoStudentsLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/info-students-level.repository";
import type { SearchStudentsLevelsDto } from "@/app/admin-desk/student-level/application/dtos/search-students-levels.dto";
import type { StudentSearchProjection } from "@/app/admin-desk/student-level/domain/projections/StudentSearch.projection";

export class SearchStudentsUseCase {
    public constructor(private readonly repository: InfoStudentsLevelRepository) {}

    public async execute(dto: SearchStudentsLevelsDto): Promise<StudentSearchProjection[]> {
        return this.repository.searchStudents(dto);
    }
}
