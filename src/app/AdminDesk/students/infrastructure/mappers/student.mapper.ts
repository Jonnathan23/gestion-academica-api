import { StudentEntity } from "@/app/AdminDesk/students/domain";
import { studentContractStatus, studentProgressCategory } from "@/app/AdminDesk/students/domain/interfaces/Students.interface";
import { type StudentContractStatus, type StudentProgressCategory } from "@/app/AdminDesk/students/domain/interfaces/Students.interface";
import { CustomError } from "@/core/error";

export const StudentMapper = {
    studentModelToEntity(object: { [key: string]: any }): StudentEntity {
        const { st_id, st_identification_card, st_full_name, st_phone_number,
            st_start_date, st_is_graduated, st_contract_status, st_progress_category,
            st_created_at, st_updated_at } = object;


        if (!st_id || !st_identification_card || !st_full_name || !st_phone_number || !st_start_date || st_is_graduated === undefined || !st_contract_status || !st_progress_category || !st_created_at || !st_updated_at) {
            throw CustomError.internalServer('Invalid student model');
        }

        if (!Object.values(studentContractStatus).includes(st_contract_status)) {
            throw CustomError.internalServer('Invalid student contract status');
        }

        if (!Object.values(studentProgressCategory).includes(st_progress_category)) {
            throw CustomError.internalServer('Invalid student progress category');
        }

        return new StudentEntity(
            st_id,
            st_identification_card,
            st_full_name,
            st_phone_number,
            new Date(st_start_date),
            st_is_graduated,
            st_contract_status as StudentContractStatus,
            st_progress_category as StudentProgressCategory,
            new Date(st_created_at),
            new Date(st_updated_at)
        );
    }
}
