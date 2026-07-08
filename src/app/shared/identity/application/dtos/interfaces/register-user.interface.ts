import type { UserRoles } from "@/core/interfaces/Roles.interfaces";

export interface RegisterUserProps {
    us_full_name: string;
    us_email: string;
    us_password_hash: string;
    us_role: UserRoles;
}
