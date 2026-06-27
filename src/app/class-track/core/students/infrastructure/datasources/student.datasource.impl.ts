import { Op } from "sequelize";

import Student, { studentContractStatus } from "@/data/models/admin-desk/Student.model";
import StudentModule from "@/data/models/admin-desk/StudentModule.model";
import Module from "@/data/models/admin-desk/Module.model";

import { studentModuleStatus } from "@/core/interfaces/Contracts.interface";
import { CustomError } from "@/core/error/customError.error";
import { Validators } from "@/core/utils/Validators";

import type { StudentWithLevelActiveDetails } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActiveDetails.projection";
import type { StudentWithLevelActive } from "@/app/class-track/core/students/domain/projections/StudentWithLevelActive.projection";
import type { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";
import type { StudentClassTrackDataSource } from "@/app/class-track/core/students/domain/datasources/student.datasource";
import type { SearchStudentsDto } from "@/app/class-track/core/students/domain/dtos/SearchStudentDto.dto";

import { StudentWithLevelActiveDetailsProjectionMapper } from "@/app/class-track/core/students/infrastructure/mappers/activeStudentDetailsProjection.mapper";
import { StudentWithLevelActiveProjectionMapper } from "@/app/class-track/core/students/infrastructure/mappers/activeStudentProjection.mapper";
import { StudentMapper } from "@/app/class-track/core/students/infrastructure/mappers/student.mapper";

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

    public async findStudentWithLevelActiveDetails(studentId: string): Promise<StudentWithLevelActiveDetails> {
        const student = await Student.findOne({
            where: { st_id: studentId },
            include: [
                {
                    model: StudentModule,
                    where: {
                        st_mod_status: studentModuleStatus.Active,
                    },
                    required: false,
                    include: [
                        {
                            model: Module,
                            required: true,
                        },
                    ],
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

        return StudentWithLevelActiveDetailsProjectionMapper.entityFromObject({ student, moduleActive, moduleInfo: moduleActive.module });
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

        const isUuidValid = Validators.isUUID(searchTerm);

        const whereCondition = isUuidValid
            ? { st_id: searchTerm }
            : {
                  [Op.or]: [
                      { st_full_name: { [Op.iLike]: `%${searchTerm}%` } },
                      { st_identification_card: { [Op.iLike]: `%${searchTerm}%` } },
                  ],
              };

        return await Student.findAll({
            where: whereCondition,
            limit,
            order: [["st_full_name", "ASC"]],
        });
    }

    private async convertArrayToProjection(students: Student[]): Promise<StudentClassTrackProjection[]> {
        return students.map((student) => StudentMapper.studentClassTrackProjectionFromObject(student));
    }
}
