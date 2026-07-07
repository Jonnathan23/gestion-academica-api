import type { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/domain/dtos";
import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/studentLevel.repository";

export interface BlockLevelUseCase {
    execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity>;
}

export class BlockLevel implements BlockLevelUseCase {
    public constructor(private readonly repository: StudentLevelRepository) {}

    public execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        return this.repository.blockLevel(dto);
    }
}
