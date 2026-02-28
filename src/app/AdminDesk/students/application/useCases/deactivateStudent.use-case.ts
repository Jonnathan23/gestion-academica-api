import type { StudentEntity, StudentRepository } from "@/app/AdminDesk/students/domain";

export interface DeactivateStudentUseCase {
    execute(id: string): Promise<StudentEntity>;
}

export class DeactivateStudent implements DeactivateStudentUseCase {

    constructor(
        private readonly repository: StudentRepository
    ) { }

    execute(id: string): Promise<StudentEntity> {
        return this.repository.deactivate(id);
    }
}
