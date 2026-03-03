import { CustomError } from "@/core/error";
import { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";

export class StudentLevelMapper {
    static studentLevelEntityFromObject(object: { [key: string]: any }): StudentLevelEntity {
        const { st_mod_id, st_mod_student_id, st_mod_module_id, st_mod_seller_id,
            st_mod_status, st_mod_purchase_date, st_mod_created_at, st_mod_updated_at, } = object;

        if (!st_mod_id) throw CustomError.internalServer("Missing st_mod_id");
        if (!st_mod_student_id) throw CustomError.internalServer("Missing st_mod_student_id");
        if (!st_mod_module_id) throw CustomError.internalServer("Missing st_mod_module_id");
        if (!st_mod_seller_id) throw CustomError.internalServer("Missing st_mod_seller_id");
        if (!st_mod_status) throw CustomError.internalServer("Missing st_mod_status");

        return new StudentLevelEntity(
            st_mod_id,
            st_mod_student_id,
            st_mod_module_id,
            st_mod_seller_id,
            st_mod_status,
            st_mod_purchase_date,
            st_mod_created_at,
            st_mod_updated_at,
        );
    }
}
