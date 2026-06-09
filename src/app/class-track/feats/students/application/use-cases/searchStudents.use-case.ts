import type { SearchStudentsDto } from "@/app/class-track/feats/students/domain/dtos/SearchStudentDto.dto";
import type { StudentClassTrackProjection } from "@/app/class-track/feats/students/domain/projections/StudentClassTrack.projection";
import type { StudentRepository } from "@/app/class-track/feats/students/domain/repositories/student.repository";

export class SearchStudentsUseCase {
    constructor(private readonly studentRepository: StudentRepository) {}

    public execute(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]> {
        return this.studentRepository.searchStudents(dto);
    }
}
