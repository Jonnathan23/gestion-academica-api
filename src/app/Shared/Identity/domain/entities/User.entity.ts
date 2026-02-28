import type { UserRoles } from "@/core/interfaces";


export class UserEntity {
    constructor(
        public us_id: string,
        public us_full_name: string,
        public us_email: string,
        public us_password_hash: string,
        public us_role: UserRoles,
        public us_is_active: string,
        public us_created_at: string,
        public us_updated_at: string,
    ) { }
}