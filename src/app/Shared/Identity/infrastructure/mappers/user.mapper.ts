import { UserEntity } from "@/app/Shared/Identity/domain/entities";
import { CustomError } from "@/core/error";


export const UserMapper = {
    userModelToEntity(object: { [key: string]: any }): UserEntity {

        const { us_id, us_full_name, us_email, us_password_hash, us_role, us_is_active, us_created_at, us_updated_at } = object;
        console.log("us_id", us_id, "\nus_full_name", us_full_name, "\nus_email", us_email, "\nus_password_hash", us_password_hash, "\nus_role", us_role, "\nus_is_active", us_is_active, "\nus_created_at", us_created_at, "\nus_updated_at", us_updated_at);
        if (!us_id || !us_full_name || !us_email || !us_password_hash || !us_role || us_is_active === undefined || !us_created_at || !us_updated_at) {
            throw CustomError.internalServer("Invalid user model");
        }

        return new UserEntity(
            us_id,
            us_full_name,
            us_email,
            us_password_hash,
            us_role,
            us_is_active,
            us_created_at,
            us_updated_at
        )
    }
}