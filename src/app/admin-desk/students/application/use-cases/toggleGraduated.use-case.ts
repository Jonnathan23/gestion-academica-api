import type { StudentEntity, StudentRepository } from "@/app/admin-desk/students/domain";

export interface ToggleGraduatedUseCase {
    execute(id: string): Promise<StudentEntity>;
}

export class ToggleGraduated implements ToggleGraduatedUseCase {
    constructor(private readonly repository: StudentRepository) {}

    execute(id: string): Promise<StudentEntity> {
        return this.repository.toggleGraduated(id);
    }
}
