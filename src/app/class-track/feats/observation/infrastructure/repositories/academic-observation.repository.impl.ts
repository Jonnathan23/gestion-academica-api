import type { AcademicObservationRepository } from "@/app/class-track/feats/observation/domain/repositories/academicObservation.repository";
import type { AcademicObservationDatasource } from "@/app/class-track/feats/observation/domain/datasource/academicObservation.datasource";
import type { CreateAcademicObservationDto } from "@/app/class-track/feats/observation/domain/dtos/create-academic-observation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/feats/observation/domain/entities/academic-observation.entity";

export class AcademicObservationRepositoryImpl implements AcademicObservationRepository {
    public constructor(private readonly datasource: AcademicObservationDatasource) {}

    public async createObservation(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity> {
        return this.datasource.createObservation(dto);
    }
}
