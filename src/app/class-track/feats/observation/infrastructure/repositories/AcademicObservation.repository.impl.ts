import type { AcademicObservationRepository } from "@/app/class-track/feats/observation/domain/repositories/AcademicObservation.repository";
import type { AcademicObservationDatasource } from "@/app/class-track/feats/observation/domain/datasource/AcademicObservation.datasource";
import type { CreateAcademicObservationDto } from "@/app/class-track/feats/observation/domain/dtos/CreateAcademicObservation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/feats/observation/domain/entities/AcademicObservation.entity";

export class AcademicObservationRepositoryImpl implements AcademicObservationRepository {
    constructor(private readonly datasource: AcademicObservationDatasource) {}

    public async createObservation(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity> {
        return this.datasource.createObservation(dto);
    }
}
