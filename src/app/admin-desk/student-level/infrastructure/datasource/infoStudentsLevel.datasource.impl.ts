import { Op, Sequelize } from "sequelize";
import Student from "@/data/models/admin-desk/student.model";
import StudentModule from "@/data/models/admin-desk/student-module.model";
import Module from "@/data/models/admin-desk/module.model";
import { CustomError } from "@/core/error";

import type { InfoStudentsLevelDataSource } from "@/app/admin-desk/student-level/domain/datasource/infoStudentsLevel.datasource";
import type { SearchStudentsLevelsDto } from "@/app/admin-desk/student-level/domain/dtos/search-students-levels.dto";
import type { GetStudentTimelineDto } from "@/app/admin-desk/student-level/domain/dtos/get-student-timeline.dto";
import type { StudentSearchProjection } from "@/app/admin-desk/student-level/domain/projections/StudentSearch.projection";
import type { StudentTimelineProjection } from "@/app/admin-desk/student-level/domain/projections/StudentTimeline.projection";
import { InfoStudentsLevelMapper } from "@/app/admin-desk/student-level/infrastructure/mappers/info-students-level.mapper";

export class InfoStudentsLevelDataSourceImpl implements InfoStudentsLevelDataSource {
    public async searchStudents(dto: SearchStudentsLevelsDto): Promise<StudentSearchProjection[]> {
        const rawStudents = await this.fetchStudentsWithEnrolledCount(dto);

        return await this.mapToSearchProjections(rawStudents);
    }

    public async getStudentTimeline(dto: GetStudentTimelineDto): Promise<StudentTimelineProjection> {
        const student = await this.fetchStudentProfile(dto.studentId);

        if (!student) {
            throw CustomError.notFound("Student profile not found");
        }

        const enrolledLevels = await this.fetchStudentEnrolledLevels(dto.studentId);
        const availableModules = await this.fetchAvailableModulesForUpsell(dto.studentId);

        return await this.mapToTimelineProjection(student, enrolledLevels, availableModules);
    }

    //* Private Fetching Methods

    private async fetchStudentsWithEnrolledCount(dto: SearchStudentsLevelsDto): Promise<any[]> {
        const { searchTerm, limit } = dto;
        const searchCondition = searchTerm
            ? {
                  [Op.or]: [
                      { st_full_name: { [Op.iLike]: `%${searchTerm}%` } },
                      { st_identification_card: { [Op.iLike]: `%${searchTerm}%` } },
                  ],
              }
            : {};

        const rawResult = await Student.findAll({
            where: searchCondition,
            attributes: [
                "st_id",
                "st_identification_card",
                "st_full_name",
                "st_email",
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "StudentModules" AS "sm"
                        WHERE "sm"."st_mod_student_id" = "Student"."st_id"
                    )`),
                    "totalEnrolledLevels",
                ],
            ],
            limit: limit,
            order: [["st_full_name", "ASC"]],
            raw: true, // we want raw objects for the mapper
        });

        return rawResult;
    }

    private async fetchStudentProfile(studentId: string): Promise<any> {
        const student = await Student.findByPk(studentId, {
            attributes: ["st_id", "st_full_name", "st_phone_number", "st_start_date"],
            raw: true,
        });

        return student;
    }

    private async fetchStudentEnrolledLevels(studentId: string): Promise<any[]> {
        const enrolled = await StudentModule.findAll({
            where: { st_mod_student_id: studentId },
            include: [
                {
                    model: Module,
                    attributes: ["mo_id", "mo_name", "mo_level"],
                },
            ],
            attributes: ["st_mod_id", "st_mod_status", "st_mod_purchase_date"],
            // Get raw: true but with nest: true to keep the module association as a nested object
            raw: true,
            nest: true,
        });

        return enrolled;
    }

    private async fetchAvailableModulesForUpsell(studentId: string): Promise<any[]> {
        //? Leer y verificar si no es mas opmito otra cosa
        const available = await Module.findAll({
            where: {
                mo_id: {
                    [Op.notIn]: Sequelize.literal(`(
                        SELECT "st_mod_module_id"
                        FROM "StudentModules"
                        WHERE "st_mod_student_id" = '${studentId}'
                    )`),
                },
            },
            attributes: ["mo_id", "mo_name", "mo_level", "mo_description"],
            raw: true,
        });

        return available;
    }

    //* Private Isolated Mapping Methods

    private async mapToSearchProjections(rawStudents: any[]): Promise<StudentSearchProjection[]> {
        return rawStudents.map((rawStudent) => InfoStudentsLevelMapper.studentSearchFromObject(rawStudent));
    }

    private async mapToTimelineProjection(
        studentRaw: any,
        enrolledLevelsRaw: any[],
        availableModulesRaw: any[],
    ): Promise<StudentTimelineProjection> {
        return InfoStudentsLevelMapper.studentTimelineFromObject({
            studentRaw,
            enrolledLevelsRaw,
            availableModulesRaw,
        });
    }
}
