import type { Request, Response, NextFunction } from "express";

import type { StudentRepository } from "@/app/AdminDesk/students/domain/repositories/student.repository";
import { RegisterStudentDto } from "@/app/AdminDesk/students/domain/dtos/RegisterStudent.dto";
import { RegisterStudent, SearchStudents } from "@/app/AdminDesk/students/application";
import { CustomError } from "@/core/error";
import { SuccessResponse } from "@/core/utils";
import type { StudentEntity } from "@/app/AdminDesk/students/domain/entities/Student.entity";

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

}
