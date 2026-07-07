import { CustomError } from "@/core/error/customError.error";
import { StudentBasicMapper } from "@/app/class-track/feats/retention-alerts/infrastructure/mappers/students/student-basic.mapper";
import { RetentionAlertWithStudentProjection } from "@/app/class-track/feats/retention-alerts/domain/projections/RetentionAlertWithStudent.projection";

export class RetentionAlertWithStudentMapper {
    public static create(object: { [key: string]: any }): RetentionAlertWithStudentProjection {
        const {
            re_al_id,
            re_al_contact_date,
            re_al_has_responded,
            re_al_days_absent,
            re_al_is_justified,
            re_al_justification_reason,
            re_al_return_deadline,
            re_al_observations,
            re_al_status,
            re_al_created_at,
            student,
        } = object;

        if (!re_al_id) throw CustomError.internalServer("Invalid RetentionAlert model: missing id");
        if (!re_al_status) throw CustomError.internalServer("Invalid RetentionAlert model: missing status");
        if (!student) throw CustomError.internalServer("Invalid RetentionAlert model: missing student info");

        // The student object comes as an inner property if mapped via Sequelize include
        // or we need to extract from raw depending on query. Assuming Sequelize nested object:
        const studentProjection = StudentBasicMapper.create(student);

        return new RetentionAlertWithStudentProjection(
            re_al_id,
            re_al_contact_date ? new Date(re_al_contact_date) : null,
            re_al_has_responded || false,
            re_al_days_absent || 0,
            re_al_is_justified || false,
            re_al_justification_reason || null,
            re_al_return_deadline ? new Date(re_al_return_deadline) : null,
            re_al_observations || "",
            re_al_status,
            studentProjection,
            new Date(re_al_created_at),
        );
    }
}
