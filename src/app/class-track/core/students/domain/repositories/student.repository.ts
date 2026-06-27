import type { SearchStudentsDto } from "@/app/class-track/core/students/domain/dtos/SearchStudentDto.dto";

import type { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";
import type { StudentWithLevelActive } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActive.projection";
import type { StudentWithLevelActiveDetails } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActiveDetails.projection";

export abstract class StudentClassTrackRepository {
    public abstract searchStudents(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]>;
    public abstract findStudentWithLevelActive(studentId: string): Promise<StudentWithLevelActive>;
    public abstract findStudentWithLevelActiveDetails(studentId: string): Promise<StudentWithLevelActiveDetails>;
    public abstract getActiveContractsCount(): Promise<number>;
}
