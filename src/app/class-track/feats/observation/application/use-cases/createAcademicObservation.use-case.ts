import type { AcademicObservationRepository } from "@/app/class-track/feats/observation/domain/repositories/academicObservation.repository";
import type { CreateAcademicObservationDto } from "@/app/class-track/feats/observation/domain/dtos/CreateAcademicObservation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/feats/observation/domain/entities/AcademicObservation.entity";

export class CreateAcademicObservationUseCase {
    public constructor(private readonly academicObservationRepository: AcademicObservationRepository) {}

    public async execute(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity> {
        return await this.academicObservationRepository.createObservation(dto);
    }
}
