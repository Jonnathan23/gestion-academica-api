import type { StudentEntity, StudentRepository } from "@/app/admin-desk/students/domain";

export interface ToggleGraduatedUseCase {
    execute(id: string): Promise<StudentEntity>;
}

export class ToggleGraduated implements ToggleGraduatedUseCase {
    public constructor(private readonly repository: StudentRepository) {}

    public execute(id: string): Promise<StudentEntity> {
        return this.repository.toggleGraduated(id);
    }
}
