import type { InfoStudentsLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/infoStudentsLevel.repository";
import type { SearchStudentsLevelsDto } from "@/app/admin-desk/student-level/domain/dtos/SearchStudentsLevels.dto";
import type { StudentSearchProjection } from "@/app/admin-desk/student-level/domain/projections/StudentSearch.projection";

export class SearchStudentsUseCase {
    constructor(private readonly repository: InfoStudentsLevelRepository) {}

    public async execute(dto: SearchStudentsLevelsDto): Promise<StudentSearchProjection[]> {
        return this.repository.searchStudents(dto);
    }
}
