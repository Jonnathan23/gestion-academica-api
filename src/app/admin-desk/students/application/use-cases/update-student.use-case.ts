import { UpdateStudentDto } from "@/app/admin-desk/students/application/dtos/update-student.dto";
import { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";
import { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";

export interface UpdateStudentUseCase {
    execute(id: string, dto: UpdateStudentDto): Promise<StudentEntity>;
}

export class UpdateStudent implements UpdateStudentUseCase {
    public constructor(private readonly repository: StudentRepository) {}

    public execute(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
        return this.repository.update(id, dto);
    }
}
