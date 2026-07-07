import type { InfoStudentsLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/info-students-level.repository";
import type { InfoStudentsLevelDataSource } from "@/app/admin-desk/student-level/domain/datasource/infoStudentsLevel.datasource";
import type { SearchStudentsLevelsDto } from "@/app/admin-desk/student-level/domain/dtos/search-students-levels.dto";
import type { GetStudentTimelineDto } from "@/app/admin-desk/student-level/domain/dtos/get-student-timeline.dto";
import type { StudentSearchProjection } from "@/app/admin-desk/student-level/domain/projections/StudentSearch.projection";
import type { StudentTimelineProjection } from "@/app/admin-desk/student-level/domain/projections/StudentTimeline.projection";

export class InfoStudentsLevelRepositoryImpl implements InfoStudentsLevelRepository {
    public constructor(private readonly dataSource: InfoStudentsLevelDataSource) {}

    public async searchStudents(dto: SearchStudentsLevelsDto): Promise<StudentSearchProjection[]> {
        return this.dataSource.searchStudents(dto);
    }

    public async getStudentTimeline(dto: GetStudentTimelineDto): Promise<StudentTimelineProjection> {
        return this.dataSource.getStudentTimeline(dto);
    }
}
