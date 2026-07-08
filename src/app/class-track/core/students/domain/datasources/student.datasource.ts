import type { SearchStudentsDto } from "@/app/class-track/core/students/application/dtos/search-student-dto.dto";

import type { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";
import type { StudentWithLevelActive } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActive.projection";
import type { StudentWithLevelActiveDetails } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActiveDetails.projection";

export abstract class StudentClassTrackDataSource {
    public abstract searchStudents(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]>;
    public abstract findStudentWithLevelActive(studentId: string): Promise<StudentWithLevelActive>;
    public abstract findStudentWithLevelActiveDetails(studentId: string): Promise<StudentWithLevelActiveDetails>;
    public abstract getActiveContractsCount(): Promise<number>;
}
