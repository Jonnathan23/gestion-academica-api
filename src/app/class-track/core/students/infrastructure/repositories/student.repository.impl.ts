import type { StudentClassTrackDataSource } from "@/app/class-track/core/students/domain/datasources/student.datasource";
import type { SearchStudentsDto } from "@/app/class-track/core/students/domain/dtos/SearchStudentDto.dto";
import type { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";
import type { StudentWithLevelActive } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActive.projection";
import type { StudentWithLevelActiveDetails } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActiveDetails.projection";
import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";

export class StudentClassTrackRepositoryImpl implements StudentClassTrackRepository {
    constructor(private readonly dataSource: StudentClassTrackDataSource) {}

    public findStudentWithLevelActiveDetails(studentId: string): Promise<StudentWithLevelActiveDetails> {
        return this.dataSource.findStudentWithLevelActiveDetails(studentId);
    }

    public searchStudents(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]> {
        return this.dataSource.searchStudents(dto);
    }

    public async findStudentWithLevelActive(studentId: string): Promise<StudentWithLevelActive> {
        return this.dataSource.findStudentWithLevelActive(studentId);
    }

    public async getActiveContractsCount(): Promise<number> {
        return this.dataSource.getActiveContractsCount();
    }
}
