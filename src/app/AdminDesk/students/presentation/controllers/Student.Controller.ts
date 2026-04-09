import type { Request, Response, NextFunction } from "express";

import type { StudentRepository } from "@/app/AdminDesk/students/domain/repositories/student.repository";
import { RegisterStudentDto, UpdateStudentDto, ChangeContractStatusDto } from "@/app/AdminDesk/students/domain";
import { RegisterStudent, SearchStudents, UpdateStudent, ChangeContractStatus, ToggleGraduated, DeactivateStudent } from "@/app/AdminDesk/students/application";
import { CustomError } from "@/core/error";
import { SuccessResponse } from "@/core/utils";
import type { StudentEntity } from "@/app/AdminDesk/students/domain/entities/Student.entity";
import { GetAllStudents } from "@/app/AdminDesk/students/application/useCases/getAllStudents.use-case";

export class StudentController {

    constructor(
        private readonly studentRepository: StudentRepository
    ) { }

    register = (req: Request, res: Response, next: NextFunction) => {
        const [error, registerStudentDto] = RegisterStudentDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        const registerStudent = new RegisterStudent(this.studentRepository);

        registerStudent.execute(registerStudentDto!)
            .then(student => {
                const successMessage = "Student registered successfully";
                SuccessResponse.created<StudentEntity>(res, successMessage, student);
            })
            .catch(error => { next(error); });
    }

    getAllStudents = (req: Request, res: Response, next: NextFunction) => {
        const getAllStudents = new GetAllStudents(this.studentRepository);

        getAllStudents.execute()
            .then(students => {
                const successMessage = "Students found successfully";
                SuccessResponse.ok<StudentEntity[]>(res, successMessage, students);
            })
            .catch(error => { next(error); });
    }

    search = (req: Request, res: Response, next: NextFunction) => {
        const query = req.query.q as string || "";
        
        const searchStudents = new SearchStudents(this.studentRepository);

        searchStudents.execute(query)
            .then(students => {
                const successMessage = "Students found successfully";
                SuccessResponse.ok<StudentEntity[]>(res, successMessage, students);
            })
            .catch(error => { next(error); });
    }

    update = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const [error, updateStudentDto] = UpdateStudentDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        const updateStudent = new UpdateStudent(this.studentRepository);

        updateStudent.execute(id as string, updateStudentDto!)
            .then(student => {
                const successMessage = "Student updated successfully";
                SuccessResponse.ok<StudentEntity>(res, successMessage, student);
            })
            .catch(error => { next(error); });
    }

    changeContractStatus = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const [error, changeContractStatusDto] = ChangeContractStatusDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        const changeContractStatus = new ChangeContractStatus(this.studentRepository);

        changeContractStatus.execute(id as string, changeContractStatusDto!)
            .then(student => {
                const successMessage = "Student contract status changed successfully";
                SuccessResponse.ok<StudentEntity>(res, successMessage, student);
            })
            .catch(error => { next(error); });
    }

    toggleGraduated = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const toggleGraduated = new ToggleGraduated(this.studentRepository);

        toggleGraduated.execute(id as string)
            .then(student => {
                const successMessage = "Student graduated status toggled successfully";
                SuccessResponse.ok<StudentEntity>(res, successMessage, student);
            })
            .catch(error => { next(error); });
    }

    deactivate = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deactivateStudent = new DeactivateStudent(this.studentRepository);

        deactivateStudent.execute(id as string)
            .then(student => {
                const successMessage = "Student deactivated successfully";
                SuccessResponse.ok<StudentEntity>(res, successMessage, student);
            })
            .catch(error => { next(error); });
    }

}
