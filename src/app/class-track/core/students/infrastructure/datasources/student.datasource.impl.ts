import { Op } from "sequelize";
import Student, { studentContractStatus } from "@/data/models/admin-desk/Student.model";

import type { SearchStudentsDto } from "@/app/class-track/core/students/domain/dtos/SearchStudentDto.dto";
import type { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";
import { StudentMapper } from "@/app/class-track/core/students/infrastructure/mappers/student.mapper";
import type { StudentClassTrackDataSource } from "@/app/class-track/core/students/domain/datasources/student.datasource";
import type { StudentWithLevelActive } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActive.projection";
import StudentModule from "@/data/models/admin-desk/StudentModule.model";
import { CustomError } from "@/core/error/customError.error";
import { studentModuleStatus } from "@/core/interfaces/Contracts.interface";
import { StudentWithLevelActiveProjectionMapper } from "@/app/class-track/core/students/infrastructure/mappers/activeStudentProjection.mapper";

export class StudentClassTrackDataSourceImpl implements StudentClassTrackDataSource {
    public async searchStudents(dto: SearchStudentsDto): Promise<StudentClassTrackProjection[]> {
        const students = await this.fetchStudentsMatchingTerm(dto);
        return await this.convertArrayToProjection(students);
    }

    public async findStudentWithLevelActive(studentId: string): Promise<StudentWithLevelActive> {
        const student = await Student.findOne({
            where: { st_id: studentId },
            include: [
                {
                    model: StudentModule,
                    where: {
                        st_mod_status: studentModuleStatus.Active,
                    },
                    required: false,
                },
            ],
        });

        if (!student) {
            throw CustomError.notFound("Estudiante no encontrado en el sistema");
        }

        const moduleActive = student.student_modules.find((module) => module.st_mod_status === studentModuleStatus.Active);

        if (!moduleActive) {
            throw CustomError.forbidden("El estudiante no tiene contratos o módulos activos");
        }

        return StudentWithLevelActiveProjectionMapper.entityFromObject({ student, moduleActive });
    }

    public async getActiveContractsCount(): Promise<number> {
        const count = await Student.count({
            where: {
                st_contract_status: studentContractStatus.Active,
            },
        });

        return count;
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
