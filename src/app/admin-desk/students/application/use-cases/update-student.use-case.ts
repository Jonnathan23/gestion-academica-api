import type { UpdateStudentDto, StudentEntity, StudentRepository } from "@/app/admin-desk/students/domain";

export interface UpdateStudentUseCase {
    execute(id: string, dto: UpdateStudentDto): Promise<StudentEntity>;
}

export class UpdateStudent implements UpdateStudentUseCase {
    public constructor(private readonly repository: StudentRepository) {}

    public execute(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
        return this.repository.update(id, dto);
    }
}
