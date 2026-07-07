import { Op } from "sequelize";

import type { StudentDataSource } from "@/app/admin-desk/students/domain/datasource/student.datasource";
import { studentContractStatus, studentProgressCategory } from "@/core/interfaces/students.interface";
import { StudentMapper } from "@/app/admin-desk/students/infrastructure/mappers/student.mapper";
import type { PaginatedResult } from "@/core/interfaces/paginated-result.interface";
import { RegisterStudentDto } from "@/app/admin-desk/students/domain/dtos/register-student.dto";
import { UpdateStudentDto } from "@/app/admin-desk/students/domain/dtos/update-student.dto";
import { ChangeContractStatusDto } from "@/app/admin-desk/students/domain/dtos/change-contract-status.dto";
import { SearchStudentsByCriteriaDto } from "@/app/admin-desk/students/domain/dtos/search-students-by-criteria.dto";
import { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";
import Student from "@/data/models/admin-desk/student.model";
import { CustomError } from "@/core/error/customError.error";
import { Validators } from "@/core/utils/validators";

export class StudentDataSourceImpl implements StudentDataSource {
    public async register(dto: RegisterStudentDto): Promise<StudentEntity> {
        const { identificationCard, fullName, phoneNumber, email, dateOfBirth, nationality, certificateType, startDate } = dto;

        const studentExist = await Student.findOne({ where: { st_identification_card: identificationCard } });

        if (studentExist) {
            throw CustomError.badRequest("Student already exists with that identification card");
        }

        const newStudent = await Student.create({
            st_identification_card: identificationCard,
            st_full_name: fullName,
            st_phone_number: phoneNumber,
            st_email: email,
            st_date_of_birth: dateOfBirth,
            st_nationality: nationality,
            st_certificate_type: certificateType,
            st_start_date: startDate,
            st_contract_status: studentContractStatus.Active,
            st_progress_category: studentProgressCategory.NotEnoughData,
            st_is_graduated: false,
        });

        return StudentMapper.studentModelToEntity(newStudent);
    }

    public async search(searchQuery: string): Promise<StudentEntity[]> {
        const isUuidValid = Validators.isUUID(searchQuery);

        const searchConditions: any[] = [
            { st_identification_card: { [Op.iLike]: `%${searchQuery}%` } },
            { st_full_name: { [Op.iLike]: `%${searchQuery}%` } },
        ];

        if (isUuidValid) searchConditions.push({ st_id: { [Op.eq]: searchQuery } });

        const finalCondition = searchQuery ? { [Op.or]: searchConditions } : {};

        const students = await Student.findAll({
            where: finalCondition,
        });

        return students.map((student) => StudentMapper.studentModelToEntity(student));
    }

    public async searchByCriteria(dto: SearchStudentsByCriteriaDto): Promise<PaginatedResult<StudentEntity>> {
        const { page, searchTerm, st_nationality, st_certificate_type, st_is_graduated, st_contract_status, st_progress_category } = dto;

        const limit = 10;
        const offset = (page - 1) * limit;

        const whereClause: any = {};

        if (searchTerm) {
            whereClause[Op.or] = [
                { st_identification_card: { [Op.iLike]: `%${searchTerm}%` } },
                { st_full_name: { [Op.iLike]: `%${searchTerm}%` } },
                { st_phone_number: { [Op.iLike]: `%${searchTerm}%` } },
                { st_email: { [Op.iLike]: `%${searchTerm}%` } },
            ];
        }

        if (st_nationality) whereClause.st_nationality = { [Op.iLike]: `%${st_nationality}%` };

        if (st_certificate_type) whereClause.st_certificate_type = st_certificate_type;
        if (st_is_graduated !== undefined) whereClause.st_is_graduated = st_is_graduated;
        if (st_contract_status) whereClause.st_contract_status = st_contract_status;
        if (st_progress_category) whereClause.st_progress_category = st_progress_category;

        const { rows, count } = await Student.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [["st_full_name", "ASC"]],
        });

        const mappedStudents = await this.mapStudentsArray(rows);
        const totalPages = Math.ceil(count / limit);

        const paginatedResult: PaginatedResult<StudentEntity> = {
            data: mappedStudents,
            meta: {
                totalItems: count,
                itemCount: mappedStudents.length,
                itemsPerPage: limit,
                totalPages: totalPages,
                currentPage: page,
            },
        };

        return paginatedResult;
    }

    public async getAllStudents(): Promise<StudentEntity[]> {
        const students = await Student.findAll();

        return students.map((student) => StudentMapper.studentModelToEntity(student));
    }

    public async update(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
        const student = await Student.findByPk(id);

        if (!student) throw CustomError.notFound("Student not found");

        await student.update(dto.value);

        return StudentMapper.studentModelToEntity(student);
    }

    public async changeContractStatus(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity> {
        const { contractStatus } = dto;
        const student = await Student.findByPk(id);

        if (!student) throw CustomError.notFound("Student not found");

        await student.update({ st_contract_status: contractStatus });

        return StudentMapper.studentModelToEntity(student);
    }

    public async toggleGraduated(id: string): Promise<StudentEntity> {
        const student = await Student.findByPk(id);

        if (!student) throw CustomError.notFound("Student not found");

        await student.update({ st_is_graduated: !student.st_is_graduated });

        return StudentMapper.studentModelToEntity(student);
    }

    public async deactivate(id: string): Promise<StudentEntity> {
        const student = await Student.findByPk(id);

        if (!student) throw CustomError.notFound("Student not found");

        await student.update({ st_contract_status: studentContractStatus.Inactive });

        return StudentMapper.studentModelToEntity(student);
    }

    private async mapStudentsArray(students: Student[]): Promise<StudentEntity[]> {
        return students.map((student) => StudentMapper.studentModelToEntity(student));
    }
}
