import type { CreateAcademicObservationDto } from "@/app/class-track/feats/observation/domain/dtos/CreateAcademicObservation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/feats/observation/domain/entities/AcademicObservation.entity";

export abstract class AcademicObservationRepository {
    public abstract createObservation(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity>;
}
