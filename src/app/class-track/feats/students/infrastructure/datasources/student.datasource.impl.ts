import { Op } from "sequelize";
import Student from "@/data/models/admin-desk/Student.model";

import type { SearchStudentsDto } from "@/app/class-track/feats/students/domain/dtos/SearchStudentDto.dto";
import type { StudentClassTrackProjection } from "@/app/class-track/feats/students/domain/projections/StudentClassTrack.projection";
import { StudentMapper } from "@/app/class-track/feats/students/infrastructure/mappers/student.mapper";
import type { StudentDataSource } from "@/app/class-track/feats/students/domain/datasources/student.datasource";

export class StudentDataSourceImpl implements StudentDataSource {
    public async searchStudents(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]> {
        const students = await this.fetchStudentsMatchingTerm(dto);
        return await this.convertArrayToProjection(students);
    }

    private async fetchStudentsMatchingTerm(dto: SearchStudentsDto): Promise<Student[]> {
        const { searchTerm, limit } = dto;
        const searchCondition = { [Op.iLike]: `%${searchTerm}%` };

        return await Student.findAll({
            where: {
                [Op.or]: [{ st_full_name: searchCondition }, { st_identification_card: searchCondition }],
            },
            limit,
            order: [["st_full_name", "ASC"]],
        });
    }

    private async convertArrayToProjection(students: Student[]): Promise<StudentClassTrackProjection[]> {
        return students.map((student) => StudentMapper.studentClassTrackProjectionFromObject(student));
    }
}
