import { UserEntity } from "@/app/shared/identity/domain/entities/User.entity";
import { CustomError } from "@/core/error";

export const UserMapper = {
    userModelToEntity(object: { [key: string]: any }): UserEntity {
        const { us_id, us_full_name, us_email, us_password_hash, us_role, us_is_active, us_created_at, us_updated_at } = object;

        if (
            !us_id ||
            !us_full_name ||
            !us_email ||
            !us_password_hash ||
            !us_role ||
            us_is_active === undefined ||
            !us_created_at ||
            !us_updated_at
        ) {
            throw CustomError.internalServer("Invalid user model");
        }

        return new UserEntity(us_id, us_full_name, us_email, us_password_hash, us_role, us_is_active, us_created_at, us_updated_at);
    },
};
