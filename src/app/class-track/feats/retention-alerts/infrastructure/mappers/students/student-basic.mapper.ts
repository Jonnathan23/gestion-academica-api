import type { BasicStudentInfo } from "@/app/class-track/feats/retention-alerts/domain/projections/RetentionAlertWithStudent.projection";
import { CustomError } from "@/core/error/customError.error";

export class StudentBasicMapper {
    public static create(object: { [key: string]: any }): BasicStudentInfo {
        const { st_id, st_full_name, st_identification_card, st_phone_number, st_contract_status } = object;

        if (!st_id) throw CustomError.internalServer("Invalid student model: missing id");
        if (!st_full_name) throw CustomError.internalServer("Invalid student model: missing full name");
        if (!st_identification_card) throw CustomError.internalServer("Invalid student model: missing identification card");
        if (!st_phone_number) throw CustomError.internalServer("Invalid student model: missing phone number");
        if (!st_contract_status) throw CustomError.internalServer("Invalid student model: missing contract status");

        return {
            id: st_id,
            fullName: st_full_name,
            identificationCard: st_identification_card,
            phoneNumber: st_phone_number,
            contractStatus: st_contract_status,
        };
    }
}
