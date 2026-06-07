import AcademicObservation from "@/data/models/class-track/AcademicObservationAttributes.model";
import type { AcademicObservationDatasource } from "@/app/class-track/feats/observation/domain/datasource/academicObservation.datasource";
import type { CreateAcademicObservationDto } from "@/app/class-track/feats/observation/domain/dtos/CreateAcademicObservation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/feats/observation/domain/entities/AcademicObservation.entity";
import { AcademicObservationMapper } from "@/app/class-track/feats/observation/infrastructure/mappers/academicObservation.mapper";

export class AcademicObservationDatasourceImpl implements AcademicObservationDatasource {
    public async createObservation(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity> {
        const { studentId, teacherId, observation, deadline } = dto;
        const newObservation = await AcademicObservation.create({
            ac_ob_student_id: studentId,
            ac_ob_teacher_id: teacherId,
            ac_ob_observation: observation,
            ac_ob_deadline: deadline ?? undefined,
        });

        return AcademicObservationMapper.entityFromObject(newObservation);
    }
}
