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

            req.userSession = payload;

            next();
        } catch (error) {
            console.error(error);
            next(CustomError.serviceUnavailable("Internal server error validating token"));
        }
    }
}