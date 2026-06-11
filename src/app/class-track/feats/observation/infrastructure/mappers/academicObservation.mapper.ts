import { AcademicObservationEntity } from "@/app/class-track/feats/observation/domain/entities/AcademicObservation.entity";
import { CustomError } from "@/core/error/customError.error";

export class AcademicObservationMapper {
    public static entityFromObject(object: { [key: string]: any }): AcademicObservationEntity {
        const { ac_ob_id, ac_ob_student_id, ac_ob_teacher_id, ac_ob_observation, ac_ob_deadline, ac_ob_created_at, ac_ob_updated_at } =
            object;

        if (!ac_ob_id) throw CustomError.internalServer("Mapper Error: Missing ac_ob_id");
        if (!ac_ob_student_id) throw CustomError.internalServer("Mapper Error: Missing ac_ob_student_id");
        if (!ac_ob_teacher_id) throw CustomError.internalServer("Mapper Error: Missing ac_ob_teacher_id");
        if (!ac_ob_observation) throw CustomError.internalServer("Mapper Error: Missing ac_ob_observation");
        if (!ac_ob_created_at) throw CustomError.internalServer("Mapper Error: Missing ac_ob_created_at");
        if (!ac_ob_updated_at) throw CustomError.internalServer("Mapper Error: Missing ac_ob_updated_at");

        return new AcademicObservationEntity(
            ac_ob_id,
            ac_ob_student_id,
            ac_ob_teacher_id,
            ac_ob_observation,
            ac_ob_deadline ? new Date(ac_ob_deadline) : null,
            new Date(ac_ob_created_at),
            new Date(ac_ob_updated_at),
        );
    }
}
