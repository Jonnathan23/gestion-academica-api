import { StudentEntity } from "@/app/admin-desk/students/domain/entities/student.entity";
import { StudentRepository } from "@/app/admin-desk/students/domain/repositories/student.repository";

export interface DeactivateStudentUseCase {
    execute(id: string): Promise<StudentEntity>;
}

export class DeactivateStudent implements DeactivateStudentUseCase {
    public constructor(private readonly repository: StudentRepository) {}

    public execute(id: string): Promise<StudentEntity> {
        return this.repository.deactivate(id);
    }
}
