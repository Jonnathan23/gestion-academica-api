import type { UserRoles } from "@/core/interfaces";
import { Validators } from "@/core/utils";

export class RegisterUserDto {
    private constructor(
        public readonly us_full_name: string,
        public readonly us_email: string,
        public readonly us_password_hash: string,
        public readonly us_role: UserRoles,
    ) {}

    public static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { us_full_name, us_email, us_password_hash, us_role } = object;

        if (!us_full_name) return ["Missing name"];
        if (!us_email) return ["Missing email"];
        if (!us_password_hash) return ["Missing password"];
        if (!us_role) return ["Missing role"];

        if (!Validators.isEmail(us_email)) return ["Invalid email"];
        if (!Validators.isStrongPassword(us_password_hash)) return ["Invalid password"];
        if (!Validators.isRole(us_role)) return ["Invalid role"];

        return [undefined, new RegisterUserDto(us_full_name, us_email, us_password_hash, us_role)];
    }
}
