import type { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/student-level.entity";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";

export interface UnlockLevelUseCase {
    execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity>;
}

export class UnlockLevel implements UnlockLevelUseCase {
    public constructor(private readonly repository: StudentLevelRepository) {}

    public execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        return this.repository.unlockLevel(dto);
    }
}
