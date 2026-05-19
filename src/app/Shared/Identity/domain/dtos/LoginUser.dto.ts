import { Validators } from "@/core/utils";

export class LoginUserDto {
    private constructor(
        public readonly us_email: string,
        public readonly us_password_hash: string,
    ) {}

    static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
        const { us_email, us_password_hash } = object;
        if (!us_email) return ["Missing email"];
        if (!us_password_hash) return ["Missing password"];

        if (!Validators.isEmail(us_email)) return ["Invalid email"];
        if (!Validators.isStrongPassword(us_password_hash)) return ["Invalid password"];

        return [undefined, new LoginUserDto(us_email, us_password_hash)];
    }
}
