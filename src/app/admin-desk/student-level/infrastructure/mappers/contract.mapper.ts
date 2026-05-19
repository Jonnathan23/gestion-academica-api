import {
    moduleRelationFields,
    sellerRelationFields,
    StudentLevelDetailsProjection,
    studentRelationFields,
} from "@/app/admin-desk/student-level/domain/projections/ContractDetails.projection";
import { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";
import { pickFields } from "@/core/utils/object-tools";
import { CustomError } from "@/core/error";
import { ModuleMapper } from "@/app/admin-desk/modules/infrastructure/mappers/module.mapper";
import { UserMapper } from "@/app/shared/Identity/infrastructure/mappers/user.mapper";
import { StudentMapper } from "@/app/admin-desk/students/infrastructure/mappers/student.mapper";

export class StudentLevelMapper {
    public static studentLevelEntityFromObject(object: { [key: string]: any }): StudentLevelEntity {
        //TODO: cambiar por mensajes no relevativos y más amigables al cliente
        const {
            st_mod_id,
            st_mod_student_id,
            st_mod_module_id,
            st_mod_seller_id,
            st_mod_status,
            st_mod_purchase_date,
            st_mod_created_at,
            st_mod_updated_at,
        } = object;
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

    public static studentLevelDetailsEntityFromObject(object: { [key: string]: any }): StudentLevelDetailsProjection {
        // Añadimos st_mod_created_at y st_mod_updated_at para extraerlas del objeto
        const { st_mod_id, st_mod_status, st_mod_purchase_date, st_mod_created_at, st_mod_updated_at, module, seller, student } = object;

        if (!st_mod_id || !st_mod_status) {
            throw CustomError.internalServer("Missing required contract fields");
        }

        if (!module) throw CustomError.internalServer("Missing module");
        if (!seller) throw CustomError.internalServer("Missing seller");
        if (!student) throw CustomError.internalServer("Missing student");

        const moduleEntity = ModuleMapper.moduleModelToEntity(module);
        const sellerEntity = UserMapper.userModelToEntity(seller);
        const studentEntity = StudentMapper.studentModelToEntity(student);

        // Reorganizamos los argumentos para que coincidan exactamente con la firma del constructor
        const newStudentLevelDetailsProjection = new StudentLevelDetailsProjection(
            st_mod_id,
            pickFields({ objectToFilter: studentEntity, fieldsToKeep: studentRelationFields }),
            pickFields({ objectToFilter: moduleEntity, fieldsToKeep: moduleRelationFields }),
            pickFields({ objectToFilter: sellerEntity, fieldsToKeep: sellerRelationFields }),
            st_mod_status,
            st_mod_purchase_date ? new Date(st_mod_purchase_date) : new Date(),
            st_mod_created_at ? new Date(st_mod_created_at) : new Date(),
            st_mod_updated_at ? new Date(st_mod_updated_at) : new Date(),
        );

        return newStudentLevelDetailsProjection;
    }
}
