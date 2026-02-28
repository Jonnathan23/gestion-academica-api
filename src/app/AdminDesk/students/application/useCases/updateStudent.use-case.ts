import type { UpdateStudentDto, StudentEntity, StudentRepository } from "@/app/AdminDesk/students/domain";

export interface UpdateStudentUseCase {
    execute(id: string, dto: UpdateStudentDto): Promise<StudentEntity>;
}

export class UpdateStudent implements UpdateStudentUseCase {

    constructor(
        private readonly repository: StudentRepository
    ) { }

    execute(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
        return this.repository.update(id, dto);
    }
}
