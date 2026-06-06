import type { UserRoles } from "@/core/interfaces";
import type { UserState } from "@/app/shared/identity/domain/interfaces/user.interfaces";

export class UserDataEntity {
    constructor(
        public us_id: string,
        public us_full_name: string,
        public us_email: string,
        public us_role: UserRoles,
        public us_is_active: UserState,
        public permissions: string[],
    ) {}
}
