import type { StudentSearchProjection } from "@/app/admin-desk/student-level/domain/projections/StudentSearch.projection";
import type { StudentTimelineProjection } from "@/app/admin-desk/student-level/domain/projections/StudentTimeline.projection";
import type { SearchStudentsLevelsDto } from "@/app/admin-desk/student-level/domain/dtos/SearchStudentsLevels.dto";
import type { GetStudentTimelineDto } from "@/app/admin-desk/student-level/domain/dtos/GetStudentTimeline.dto";

export abstract class InfoStudentsLevelRepository {
    abstract searchStudents(dto: SearchStudentsLevelsDto): Promise<StudentSearchProjection[]>;
    abstract getStudentTimeline(dto: GetStudentTimelineDto): Promise<StudentTimelineProjection>;
}
