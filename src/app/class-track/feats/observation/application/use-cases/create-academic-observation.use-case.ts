import type { AcademicObservationRepository } from "@/app/class-track/feats/observation/domain/repositories/academic-observation.repository";
import type { CreateAcademicObservationDto } from "@/app/class-track/feats/observation/application/dtos/create-academic-observation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/feats/observation/domain/entities/academic-observation.entity";

export class CreateAcademicObservationUseCase {
    public constructor(private readonly academicObservationRepository: AcademicObservationRepository) {}

    public async execute(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity> {
        return await this.academicObservationRepository.createObservation(dto);
    }
}
