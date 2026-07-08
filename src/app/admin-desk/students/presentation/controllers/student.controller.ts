import type { Request, Response, NextFunction } from "express";

import type { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";
import type { StudentValidators } from "@/app/admin-desk/students/application/dtos/validators/interfaces/student-validators.interface";
import type { PaginatedResult } from "@/core/interfaces/paginated-result.interface";
import type { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";
import { GetAllStudents } from "@/app/admin-desk/students/application/use-cases/get-all-students.use-case";
import { RegisterStudentDto } from "@/app/admin-desk/students/application/dtos/register-student.dto";
import { UpdateStudentDto } from "@/app/admin-desk/students/application/dtos/update-student.dto";
import { ChangeContractStatusDto } from "@/app/admin-desk/students/application/dtos/change-contract-status.dto";
import { SearchStudentsByCriteriaDto } from "@/app/admin-desk/students/application/dtos/search-students-by-criteria.dto";
import { RegisterStudent } from "@/app/admin-desk/students/application/use-cases/register-student.use-case";
import { SearchStudents } from "@/app/admin-desk/students/application/use-cases/search-students.use-case";
import { UpdateStudent } from "@/app/admin-desk/students/application/use-cases/update-student.use-case";
import { ChangeContractStatus } from "@/app/admin-desk/students/application/use-cases/change-contract-status.use-case";
import { ToggleGraduated } from "@/app/admin-desk/students/application/use-cases/toggle-graduated.use-case";
import { DeactivateStudent } from "@/app/admin-desk/students/application/use-cases/deactivate-student.use-case";
import { SearchStudentsByCriteria } from "@/app/admin-desk/students/application/use-cases/search-students-by-criteria.use-case";
import { SuccessResponse } from "@/core/utils/success-response";

export class StudentController {
    public constructor(
        private readonly studentRepository: StudentRepository,
        private readonly validators: StudentValidators,
    ) {}

    public register = (req: Request, res: Response, next: NextFunction) => {
        try {
            const registerStudentDto = RegisterStudentDto.create(req.body, this.validators.registerStudentValidator);

            const registerStudent = new RegisterStudent(this.studentRepository);

            registerStudent
                .execute(registerStudentDto)
                .then((student) => {
                    const successMessage = "Student registered successfully";

                    SuccessResponse.created<StudentEntity>(res, successMessage, student);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public getAllStudents = (req: Request, res: Response, next: NextFunction) => {
        const getAllStudents = new GetAllStudents(this.studentRepository);

        getAllStudents
            .execute()
            .then((students) => {
                const successMessage = "Students found successfully";

                SuccessResponse.ok<StudentEntity[]>(res, successMessage, students);
            })
            .catch((error) => {
                next(error);
            });
    };

    public search = (req: Request, res: Response, next: NextFunction) => {
        const query = (req.query.q as string) || "";

        const searchStudents = new SearchStudents(this.studentRepository);

        searchStudents
            .execute(query)
            .then((students) => {
                const successMessage = "Students found successfully";

                SuccessResponse.ok<StudentEntity[]>(res, successMessage, students);
            })
            .catch((error) => {
                next(error);
            });
    };

    public searchStudentsByCriteria = (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchStudentsByCriteriaDto = SearchStudentsByCriteriaDto.create(
                req.query,
                this.validators.searchStudentsByCriteriaValidator,
            );

            const searchStudentsByCriteria = new SearchStudentsByCriteria(this.studentRepository);

            searchStudentsByCriteria
                .execute(searchStudentsByCriteriaDto)
                .then((paginatedResult) => {
                    const successMessage = "Students found successfully";

                    SuccessResponse.ok<PaginatedResult<StudentEntity>>(res, successMessage, paginatedResult);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public update = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const updateStudentDto = UpdateStudentDto.create(req.body, this.validators.updateStudentValidator);

            const updateStudent = new UpdateStudent(this.studentRepository);

            updateStudent
                .execute(id as string, updateStudentDto)
                .then((student) => {
                    const successMessage = "Student updated successfully";

                    SuccessResponse.ok<StudentEntity>(res, successMessage, student);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public changeContractStatus = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const changeContractStatusDto = ChangeContractStatusDto.create(req.body, this.validators.changeContractStatusValidator);

            const changeContractStatus = new ChangeContractStatus(this.studentRepository);

            changeContractStatus
                .execute(id as string, changeContractStatusDto)
                .then((student) => {
                    const successMessage = "Student contract status changed successfully";

                    SuccessResponse.ok<StudentEntity>(res, successMessage, student);
                })
                .catch((error) => {
                    next(error);
                });
        } catch (error) {
            next(error);
        }
    };

    public toggleGraduated = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const toggleGraduated = new ToggleGraduated(this.studentRepository);

        toggleGraduated
            .execute(id as string)
            .then((student) => {
                const successMessage = "Student graduated status toggled successfully";

                SuccessResponse.ok<StudentEntity>(res, successMessage, student);
            })
            .catch((error) => {
                next(error);
            });
    };

    public deactivate = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const deactivateStudent = new DeactivateStudent(this.studentRepository);

        deactivateStudent
            .execute(id as string)
            .then((student) => {
                const successMessage = "Student deactivated successfully";

                SuccessResponse.ok<StudentEntity>(res, successMessage, student);
            })
            .catch((error) => {
                next(error);
            });
    };
}
