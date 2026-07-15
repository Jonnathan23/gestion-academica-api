import type { CreateAcademicObservationDto } from "@/app/class-track/feats/observation/application/dtos/create-academic-observation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/feats/observation/domain/entities/academic-observation.entity";

export abstract class AcademicObservationRepository {
    public abstract createObservation(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity>;
}
