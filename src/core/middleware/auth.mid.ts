import type { Request, Response, NextFunction } from "express";

import { CustomError } from "@/core/error";
import { JwtAdapter } from "@/core/utils";
import type { ClientRoles } from "@/core/interfaces";
import { headerConstants, clientContextValues } from "@/core/constants/client-context";

export interface UserTokenPayload {
    id: string;
    email: string;
    role: string;
}

export interface StudentTokenPayload {
    id: string;
    sessionId: string;
    role: ClientRoles;
}

export interface AuthRequest extends Request {
    userSession?: UserTokenPayload;
    studentSession?: StudentTokenPayload;
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

    public static async getUserPayload(req: AuthRequest, res: Response, next: NextFunction) {
        let token = req.cookies?.auth_token;

        if (!token) {
            const authorization = req.header("Authorization");

            if (authorization && authorization.startsWith("Bearer ")) {
                token = authorization.split(" ").at(1);
            }
        }

        if (!token) {
            return next();
        }

        try {
            const payload = await JwtAdapter.validateToken<UserTokenPayload>(token);

            if (!payload) {
                return next();
            }

            req.userSession = payload;
            next();
        } catch (error) {
            next(error);
        }
    }

    public static async validateStudentJWT(req: AuthRequest, res: Response, next: NextFunction) {
        let token = req.cookies?.classTrackSession;

        if (!token) {
            const authorization = req.header("Authorization");

            if (authorization && authorization.startsWith("Bearer ")) {
                token = authorization.split(" ").at(1);
            }
        }

        if (!token) {
            return next(CustomError.unauthorized("You must have an active student session"));
        }

        try {
            const payload = await JwtAdapter.validateStudentToken<StudentTokenPayload>(token);

            if (!payload) {
                return next(CustomError.unauthorized("Invalid or expired student session"));
            }

            req.studentSession = payload;
            next();
        } catch (error) {
            console.error(error);
            next(CustomError.serviceUnavailable("Internal server error validating student token"));
        }
    }

    public static async validateSharedAccess(req: AuthRequest, res: Response, next: NextFunction) {
        const clientContext = req.header(headerConstants.clientContextName);

        if (!clientContext || !Object.values(clientContextValues).some((contextValue) => contextValue === clientContext)) {
            return next(CustomError.badRequest("Invalid or missing client context header"));
        }

        if (clientContext === clientContextValues.classTrackStudent) {
            return AuthMiddleware.validateStudentJWT(req, res, next);
        }

        if (clientContext === clientContextValues.salcPortal) {
            return AuthMiddleware.validateJWT(req, res, next);
        }

        return next(CustomError.badRequest("Unknown client context"));
    }

    public static async getStudentPayload(req: AuthRequest, res: Response, next: NextFunction) {
        let token = req.cookies?.classTrackSession;

        if (!token) {
            const authorization = req.header("Authorization");

            if (authorization && authorization.startsWith("Bearer ")) {
                token = authorization.split(" ").at(1);
            }
        }

        if (!token) {
            return next();
        }

        try {
            const payload = await JwtAdapter.validateStudentToken<StudentTokenPayload>(token);

            if (!payload) {
                return next();
            }

            req.studentSession = payload;
            next();
        } catch (error) {
            next(error);
        }
    }

    public static async extractSharedPayload(req: AuthRequest, res: Response, next: NextFunction) {
        const clientContext = req.header(headerConstants.clientContextName);

        if (!clientContext || !Object.values(clientContextValues).some((contextValue) => contextValue === clientContext)) {
            return next(CustomError.badRequest("Invalid or missing client context header"));
        }

        if (clientContext === clientContextValues.classTrackStudent) {
            return AuthMiddleware.getStudentPayload(req, res, next);
        }

        if (clientContext === clientContextValues.salcPortal) {
            return AuthMiddleware.getUserPayload(req, res, next);
        }

        return next(CustomError.badRequest("Unknown client context"));
    }
}
