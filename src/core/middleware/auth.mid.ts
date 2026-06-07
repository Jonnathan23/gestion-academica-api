import type { Request, Response, NextFunction } from "express";

import { CustomError } from "@/core/error";
import { JwtAdapter } from "@/core/utils";

export interface UserTokenPayload {
    id: string;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    userSession?: UserTokenPayload;
}

export class AuthMiddleware {
    private static validateUserActiveStatus: ((userId: string) => Promise<boolean>) | null = null;

    public static configure(validator: (userId: string) => Promise<boolean>) {
        this.validateUserActiveStatus = validator;
    }

    public static async validateJWT(req: AuthRequest, res: Response, next: NextFunction) {
        let token = req.cookies?.auth_token;

        if (!token) {
            const authorization = req.header("Authorization");
            if (authorization && authorization.startsWith("Bearer ")) {
                token = authorization.split(" ").at(1);
            }
        }

        if (!token) {
            return next(CustomError.unauthorized("You must be logged in"));
        }

        try {
            const payload = await JwtAdapter.validateToken<UserTokenPayload>(token);

            if (!payload) {
                return next(CustomError.unauthorized("Invalid or your session has expired"));
            }

            // Validamos que el AppRouter haya configurado el middleware correctamente
            if (!AuthMiddleware.validateUserActiveStatus) {
                return next(CustomError.internalServer("AuthMiddleware is not configured properly"));
            }

            // * HACEMOS LA VALIDACIÓN EN LA BD *
            const isActive = await AuthMiddleware.validateUserActiveStatus(payload.id);

            if (!isActive) {
                if (req.cookies?.auth_token) res.clearCookie("auth_token");
                return next(CustomError.unauthorized("Your account has been deactivated by an administrator"));
            }

            req.userSession = payload;
            next();
        } catch (error) {
            console.error(error);
            next(CustomError.serviceUnavailable("Internal server error validating token"));
        }
    }
}
