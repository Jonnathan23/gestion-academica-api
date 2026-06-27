import {
    moduleRelationFields,
    sellerRelationFields,
    StudentLevelDetailsProjection,
    studentRelationFields,
} from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import { pickFields } from "@/core/utils/objectTools";
import { CustomError } from "@/core/error";
import { ModuleMapper } from "@/app/admin-desk/modules/infrastructure/mappers/module.mapper";
import { UserMapper } from "@/app/shared/identity/infrastructure/mappers/user.mapper";
import { StudentMapper } from "@/app/admin-desk/students/infrastructure/mappers/student.mapper";

export class StudentLevelMapper {
    public static studentLevelEntityFromObject(object: { [key: string]: any }): StudentLevelEntity {
        const {
            st_mod_id,
            st_mod_student_id,
            st_mod_module_id,
            st_mod_seller_id,
            st_mod_status,
            st_mod_freeze_count,
            st_mod_reactivation_count,
            st_mod_purchase_date,
            st_mod_created_at,
            st_mod_updated_at,
        } = object;

        if (!st_mod_id) throw CustomError.internalServer("No se proporcionó el contrato requerido");
        if (!st_mod_student_id) throw CustomError.internalServer("El estudiante es requerido");
        if (!st_mod_module_id) throw CustomError.internalServer("El módulo es requerido");
        if (!st_mod_seller_id) throw CustomError.internalServer("El vendedor es requerido");
        if (!st_mod_status) throw CustomError.internalServer("El estado del contrato es requerido");

        const freezeCount = st_mod_freeze_count ?? 0;
        const reactivationCount = st_mod_reactivation_count ?? 0;

        return new StudentLevelEntity(
            st_mod_id,
            st_mod_student_id,
            st_mod_module_id,
            st_mod_seller_id,
            st_mod_status,
            freezeCount,
            reactivationCount,
            st_mod_purchase_date,
            st_mod_created_at,
            st_mod_updated_at,
        );
    }

    public static studentLevelDetailsEntityFromObject(object: { [key: string]: any }): StudentLevelDetailsProjection {
        const {
            st_mod_id,
            st_mod_status,
            st_mod_freeze_count,
            st_mod_purchase_date,
            st_mod_created_at,
            st_mod_updated_at,
            module,
            seller,
            student,
        } = object;

        if (!st_mod_id || !st_mod_status) {
            throw CustomError.internalServer("Faltan campos requeridos del contrato");
        }

        if (!module) throw CustomError.internalServer("El nivel de inglés es requerido");
        if (!seller) throw CustomError.internalServer("El vendedor es requerido");
        if (!student) throw CustomError.internalServer("El estudiante es requerido");

        const moduleEntity = ModuleMapper.moduleModelToEntity(module);
        const sellerEntity = UserMapper.userModelToEntity(seller);
        const studentEntity = StudentMapper.studentModelToEntity(student);

        const freezeCount = st_mod_freeze_count ?? 0;

        // Reorganizamos los argumentos para que coincidan exactamente con la firma del constructor
        const newStudentLevelDetailsProjection = new StudentLevelDetailsProjection(
            st_mod_id,
            pickFields({ objectToFilter: studentEntity, fieldsToKeep: studentRelationFields }),
            pickFields({ objectToFilter: moduleEntity, fieldsToKeep: moduleRelationFields }),
            pickFields({ objectToFilter: sellerEntity, fieldsToKeep: sellerRelationFields }),
            st_mod_status,
            freezeCount,
            st_mod_purchase_date ? new Date(st_mod_purchase_date) : new Date(),
            st_mod_created_at ? new Date(st_mod_created_at) : new Date(),
            st_mod_updated_at ? new Date(st_mod_updated_at) : new Date(),
        );

        return newStudentLevelDetailsProjection;
    }
}
