import type { InfoStudentsLevelRepository } from "@/app/admin-desk/student-level/domain/repositories/info-students-level.repository";
import type { GetStudentTimelineDto } from "@/app/admin-desk/student-level/application/dtos/get-student-timeline.dto";
import type { StudentTimelineProjection } from "@/app/admin-desk/student-level/domain/projections/StudentTimeline.projection";

export class GetStudentTimelineUseCase {
    public constructor(private readonly repository: InfoStudentsLevelRepository) {}

    public async execute(dto: GetStudentTimelineDto): Promise<StudentTimelineProjection> {
        return this.repository.getStudentTimeline(dto);
    }
}
