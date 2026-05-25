import type { CreateAcademicObservationDto } from "@/app/class-track/observation/domain/dtos/CreateAcademicObservation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/observation/domain/entities/AcademicObservation.entity";

export abstract class AcademicObservationDatasource {
    public abstract createObservation(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity>;
}
