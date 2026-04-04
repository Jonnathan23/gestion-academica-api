import type { LoginUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserEntity } from "@/app/Shared/Identity/domain/entities";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { rolePermissionsMapping } from "@/core/constants";
import { CustomError } from "@/core/error";
import type { UserTokenPayload } from "@/core/middleware";
import { JwtAdapter } from "@/core/utils";

interface UserResponse {
    us_id: string;
    us_full_name: string;
    us_email: string;
    us_role: string;
    us_is_active: string;
    permissions: string[];
}

interface LoginResponse {
    user: UserResponse;
    token: string;
}

interface LoginUserUseCase {
    execute(user: LoginUserDto): Promise<LoginResponse>;
}

type funtionGenerateToken = typeof JwtAdapter.generateToken;

export class LoginUser implements LoginUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly generateJWT: funtionGenerateToken = JwtAdapter.generateToken
    ) { }



    async execute(user: LoginUserDto): Promise<LoginResponse> {
        const userExist = await this.userRepository.login(user);

        // 2. Obtenemos los permisos basados en el rol del usuario autenticado
        const assignedPermissions = this.getPermissionsForRole(userExist.us_role);

        const userResponse: UserResponse = {
            us_id: userExist.us_id,
            us_full_name: userExist.us_full_name,
            us_email: userExist.us_email,
            us_role: userExist.us_role,
            us_is_active: userExist.us_is_active ? "activo" : "inactivo",
            permissions: assignedPermissions
        }

        const token = await this.generateToken(userExist);

        return {
            user: userResponse,
            token
        };
    }

    private async generateToken(user: UserEntity): Promise<string> {
        const payload: UserTokenPayload = {
            id: user.us_id,
            email: user.us_email,
            role: user.us_role
        };

        const token = await this.generateJWT(payload);
        if (!token) throw CustomError.serviceUnavailable("Error generating token");

        return token;
    }

    private getPermissionsForRole(role: string): string[] {
        return rolePermissionsMapping[role] || [];
    }
}