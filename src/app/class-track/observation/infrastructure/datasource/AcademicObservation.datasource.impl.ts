import AcademicObservation from "@/data/models/ClassTrack/AcademicObservationAttributes.model";
import { CustomError } from "@/core/error/customError.error";
import type { AcademicObservationDatasource } from "@/app/class-track/observation/domain/datasource/AcademicObservation.datasource";
import type { CreateAcademicObservationDto } from "@/app/class-track/observation/domain/dtos/CreateAcademicObservation.dto";
import type { AcademicObservationEntity } from "@/app/class-track/observation/domain/entities/AcademicObservation.entity";
import { AcademicObservationMapper } from "@/app/class-track/observation/infrastructure/mappers/academicObservation.mapper";

export class AcademicObservationDatasourceImpl implements AcademicObservationDatasource {
    public async createObservation(dto: CreateAcademicObservationDto): Promise<AcademicObservationEntity> {
        const { studentId, teacherId, observation, deadline } = dto;
        try {
            const newObservation = await AcademicObservation.create({
                ac_ob_student_id: studentId,
                ac_ob_teacher_id: teacherId,
                ac_ob_observation: observation,
                ac_ob_deadline: deadline ?? undefined,
            });

            return AcademicObservationMapper.entityFromObject(newObservation);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer("Error creating academic observation");
        }
    }
}
