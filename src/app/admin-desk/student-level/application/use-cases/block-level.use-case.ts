import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/student-level.entity";
import type { StudentLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/student-level.repository";
import { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/application/dtos/update-student-level.dto";

export interface BlockLevelUseCase {
    execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity>;
}

export class BlockLevel implements BlockLevelUseCase {
    public constructor(private readonly repository: StudentLevelRepository) {}

    public execute(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity> {
        return this.repository.blockLevel(dto);
    }
}
