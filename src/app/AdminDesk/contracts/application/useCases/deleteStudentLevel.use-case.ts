import type { StudentLevelRepository } from "@/app/AdminDesk/contracts/domain/repositories/contract.repository";

export interface DeleteStudentLevelUseCase {
    execute(studentLevelId: string): Promise<boolean>;
}

export class DeleteStudentLevel implements DeleteStudentLevelUseCase {
    constructor(
        private readonly repository: StudentLevelRepository
    ) { }

    execute(studentLevelId: string): Promise<boolean> {
        return this.repository.deleteStudentLevel(studentLevelId);
    }
}
