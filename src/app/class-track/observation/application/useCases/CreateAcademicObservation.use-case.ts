import type { AcademicObservationRepository } from "@/app/class-track/observation/domain/repositories/AcademicObservation.repository";
import type { CreateAcademicObservationDto } from "@/app/class-track/observation/domain/dtos/CreateAcademicObservation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/observation/domain/entities/AcademicObservation.entity";

export class CreateAcademicObservationUseCase {
    constructor(private readonly academicObservationRepository: AcademicObservationRepository) {}

    public async execute(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity> {
        return await this.academicObservationRepository.createObservation(dto);
    }
}
