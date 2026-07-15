import type { SearchStudentsDto } from "@/app/class-track/core/students/application/dtos/search-student-dto.dto";
import type { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";

export class SearchStudentsUseCase {
    public constructor(private readonly studentRepository: StudentClassTrackRepository) {}

    public execute(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]> {
        return this.studentRepository.searchStudents(dto);
    }
}
