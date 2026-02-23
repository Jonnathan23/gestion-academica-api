export const userRoles = {
    ADMIN: "ADMIN",
    TEACHER: "TEACHER"
} as const

export type UserRoles = typeof userRoles[keyof typeof userRoles]

export class UserEntity {
    constructor(
        public us_id: string,
        public us_full_name: string,
        public us_email: string,
        public us_password_hash: string,
        public us_role: string,
        public us_is_active: string,
        public us_created_at: string,
        public us_updated_at: string,
    ) { }
}