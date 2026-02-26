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
        const authorization = req.header("Authorization");

        if (!authorization) {
            return next(CustomError.unauthorized("You must be logged in"));
        }

        if (!authorization.startsWith("Bearer ")) {
            return next(CustomError.unauthorized("You are not authorized"));
        }

        const token = authorization.split(" ").at(1) || "";
        try {
            const payload = await JwtAdapter.validateToken<UserTokenPayload>(token);

            if (!payload) {
                return next(CustomError.unauthorized("Invalid or Your sesion has expired"));
            }

            req.userSession = payload;

            next();
        } catch (error) {
            console.error(error);
            next(CustomError.serviceUnavailable("Internal server error validating"));
        }
    }
}