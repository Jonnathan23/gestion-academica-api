
import type { UserRoles } from "@/core/interfaces";
import { Validators } from "@/core/utils";


export class UpdateUserDto {

    private constructor(
        public readonly us_full_name?: string,
        public readonly us_email?: string,
        public readonly us_role?: UserRoles,
    ) { }


    get values() {
        const returnObject: { [key: string]: any } = {};

        if (this.us_full_name) returnObject.us_full_name = this.us_full_name;
        if (this.us_email) returnObject.us_email = this.us_email;
        if (this.us_role) returnObject.us_role = this.us_role;

        return returnObject;
    }

    static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
        const { us_full_name, us_email, us_role } = object;
        if (!us_full_name && !us_email && !us_role) return ["No fields to update"];

        if (us_email !== undefined && !Validators.isEmail(us_email)) {
            return ["Invalid email"];
        }

        if (us_role !== undefined && !Validators.isRole(us_role)) {
            return ["Invalid role"];

        }

        return [undefined, new UpdateUserDto(us_full_name, us_email, us_role)];
    }
}