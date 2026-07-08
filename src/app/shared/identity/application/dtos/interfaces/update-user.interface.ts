import type { UserRoles } from "@/core/interfaces/Roles.interfaces";

export interface UpdateUserProps {
    us_full_name?: string;
    us_email?: string;
    us_role?: UserRoles;
}
