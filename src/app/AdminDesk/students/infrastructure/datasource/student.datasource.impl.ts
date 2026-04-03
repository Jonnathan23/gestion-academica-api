import { Op } from "sequelize";

import type { StudentDataSource } from "@/app/AdminDesk/students/domain/datasource/student.datasource";
import type { RegisterStudentDto, UpdateStudentDto, ChangeContractStatusDto, StudentEntity } from "@/app/AdminDesk/students/domain";
import { StudentMapper } from "@/app/AdminDesk/students/infrastructure/mappers/student.mapper";
import { CustomError } from "@/core/error";
import { Student } from "@/data/models/AdminDesk";
import { studentContractStatus, studentProgressCategory } from "@/app/AdminDesk/students/domain/interfaces/Students.interface";
import { Validators } from "@/core/utils";



type studentEntityFromObject = typeof StudentMapper.studentModelToEntity;

export class StudentDataSourceImpl implements StudentDataSource {

    constructor(
        private readonly studentEntityFromObject: studentEntityFromObject = StudentMapper.studentModelToEntity
    ) { }

    async register(dto: RegisterStudentDto): Promise<StudentEntity> {
        const { identificationCard, fullName, phoneNumber, email, dateOfBirth, nationality, certificateType, startDate } = dto;
        try {
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
                st_certificate_type: certificateType as any,
                st_start_date: startDate,
                st_contract_status: studentContractStatus.ACTIVE,
                st_progress_category: studentProgressCategory.NOT_ENOUGH_DATA,
                st_is_graduated: false
            });

            return this.studentEntityFromObject(newStudent);
        } catch (error) {
            throw error;
        }
    }

    async search(searchQuery: string): Promise<StudentEntity[]> {
        try {

            const isUuidValid = Validators.IsUUID(searchQuery);

            const searchConditions: any[] = [
                { st_identification_card: { [Op.iLike]: `%${searchQuery}%` } },
                { st_full_name: { [Op.iLike]: `%${searchQuery}%` } }
            ];

            if (isUuidValid) searchConditions.push({ st_id: { [Op.eq]: searchQuery } });

            const finalCondition = searchQuery ? { [Op.or]: searchConditions } : {};

            const students = await Student.findAll({
                where: finalCondition
            });

            return students.map(student => this.studentEntityFromObject(student));
        } catch (error) {
            throw error;
        }
    }

    async getAllStudents(): Promise<StudentEntity[]> {
        try {
            const students = await Student.findAll();
            return students.map(student => this.studentEntityFromObject(student));
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
        try {
            const student = await Student.findByPk(id);
            if (!student) throw CustomError.notFound("Student not found");

            await student.update(dto.value);

            return this.studentEntityFromObject(student);
        } catch (error) {
            throw error;
        }
    }

    async changeContractStatus(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity> {
        try {
            const { contractStatus } = dto;
            const student = await Student.findByPk(id);
            if (!student) throw CustomError.notFound("Student not found");

            await student.update({ st_contract_status: contractStatus });

            return this.studentEntityFromObject(student);
        } catch (error) {
            throw error;
        }
    }

    async toggleGraduated(id: string): Promise<StudentEntity> {
        try {
            const student = await Student.findByPk(id);
            if (!student) throw CustomError.notFound("Student not found");

            await student.update({ st_is_graduated: !student.st_is_graduated });

            return this.studentEntityFromObject(student);
        } catch (error) {
            throw error;
        }
    }

    async deactivate(id: string): Promise<StudentEntity> {
        try {
            const student = await Student.findByPk(id);
            if (!student) throw CustomError.notFound("Student not found");

            await student.update({ st_contract_status: studentContractStatus.INACTIVE });

            return this.studentEntityFromObject(student);
        } catch (error) {
            throw error;
        }
    }
}
