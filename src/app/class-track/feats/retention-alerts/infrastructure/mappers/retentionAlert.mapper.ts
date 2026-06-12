import { RetentionAlertEntity } from "@/app/class-track/feats/retention-alerts/domain/entities/RetentionAlert.entity";
import { CustomError } from "@/core/error/customError.error";

export class RetentionAlertMapper {
    public static create(object: { [key: string]: any }): RetentionAlertEntity {
        const {
            re_al_id,
            re_al_student_id,
            re_al_user_id,
            re_al_contact_date,
            re_al_has_responded,
            re_al_days_absent,
            re_al_is_justified,
            re_al_justification_reason,
            re_al_return_deadline,
            re_al_observations,
            re_al_status,
            re_al_created_at,
        } = object;

        if (!re_al_id) throw CustomError.internalServer("Invalid RetentionAlert model: missing id");
        if (!re_al_student_id) throw CustomError.internalServer("Invalid RetentionAlert model: missing student id");
        if (!re_al_status) throw CustomError.internalServer("Invalid RetentionAlert model: missing status");

        return new RetentionAlertEntity(
            re_al_id,
            re_al_student_id,
            re_al_user_id || null,
            re_al_contact_date ? new Date(re_al_contact_date) : null,
            re_al_has_responded || false,
            re_al_days_absent || 0,
            re_al_is_justified || false,
            re_al_justification_reason || null,
            re_al_return_deadline ? new Date(re_al_return_deadline) : null,
            re_al_observations || "",
            re_al_status,
            new Date(re_al_created_at),
        );
    }
}
