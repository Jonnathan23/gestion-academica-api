import { UserDataEntity } from "@/app/shared/identity/domain/entities";
import { rolePermissionsMapping } from "@/core/constants";
import { CustomError } from "@/core/error";
import { userState } from "@/app/shared/identity/domain/interfaces/user.interfaces";

export const UserDataMapper = {
    userModelToEntity(object: { [key: string]: any }): UserDataEntity {
        const { us_id, us_full_name, us_email, us_password_hash, us_role, us_is_active } = object;

        if (!us_id || !us_full_name || !us_email || !us_password_hash || !us_role || us_is_active === undefined) {
            throw CustomError.internalServer("Invalid user model");
        }

        const permissions = rolePermissionsMapping[us_role] || [];

        return new UserDataEntity(
            us_id,
            us_full_name,
            us_email,
            us_role,
            us_is_active ? userState.Active : userState.Inactive,
            permissions,
        );
    },
};
