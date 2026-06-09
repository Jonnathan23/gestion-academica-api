import type { SearchStudentsDto } from "@/app/class-track/feats/students/domain/dtos/SearchStudentDto.dto";
import type { StudentClassTrackProjection } from "@/app/class-track/feats/students/domain/projections/StudentClassTrack.projection";

export abstract class StudentDataSource {
    abstract searchStudents(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]>;
}
