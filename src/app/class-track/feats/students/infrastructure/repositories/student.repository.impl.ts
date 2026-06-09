import type { StudentDataSource } from "@/app/class-track/feats/students/domain/datasources/student.datasource";
import type { SearchStudentsDto } from "@/app/class-track/feats/students/domain/dtos/SearchStudentDto.dto";
import type { StudentClassTrackProjection } from "@/app/class-track/feats/students/domain/projections/StudentClassTrack.projection";
import type { StudentRepository } from "@/app/class-track/feats/students/domain/repositories/student.repository";

export class StudentRepositoryImpl implements StudentRepository {
    constructor(private readonly dataSource: StudentDataSource) {}

    public searchStudents(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]> {
        return this.dataSource.searchStudents(dto);
    }
}
