import {
    moduleRelationFields, sellerRelationFields, StudentLevelDetailsProjection, studentRelationFields
} from "@/app/AdminDesk/contracts/domain/projections/ContractDetails.projection";
import { StudentLevelEntity } from "@/app/AdminDesk/contracts/domain/entities/Contract.entity";
import { pickFields } from "@/core/utils/object-tools";
import { CustomError } from "@/core/error";
import { ModuleMapper } from "@/app/AdminDesk/modules/infrastructure/mappers/module.mapper";
import { UserMapper } from "@/app/Shared/Identity/infrastructure/mappers/user.mapper";
import { StudentMapper } from "@/app/AdminDesk/students/infrastructure/mappers/student.mapper";

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

    static studentLevelDetailsEntityFromObject(object: { [key: string]: any }): StudentLevelDetailsProjection {
        const { st_mod_id, st_mod_status, st_mod_purchase_date, module, seller, student } = object;

        if (!st_mod_id || !st_mod_status) {
            throw CustomError.internalServer("Missing required contract fields");
        }

        if (!module) throw CustomError.internalServer("Missing module");
        if (!seller) throw CustomError.internalServer("Missing seller");
        if (!student) throw CustomError.internalServer("Missing student");

        const moduleEntity = ModuleMapper.moduleModelToEntity(module);
        const sellerEntity = UserMapper.userModelToEntity(seller);
        const studentEntity = StudentMapper.studentModelToEntity(student);

        const newStudentLevelDetailsProjection = new StudentLevelDetailsProjection(
            st_mod_id,
            st_mod_status,
            st_mod_purchase_date ? new Date(st_mod_purchase_date) : new Date(),
            pickFields({ objectToFilter: moduleEntity, fieldsToKeep: moduleRelationFields }),
            pickFields({ objectToFilter: sellerEntity, fieldsToKeep: sellerRelationFields }),
            pickFields({ objectToFilter: studentEntity, fieldsToKeep: studentRelationFields })
        );
        console.log('newStudentLevelDetailsProjection')
        console.log(newStudentLevelDetailsProjection)
        return newStudentLevelDetailsProjection;
    }
}
