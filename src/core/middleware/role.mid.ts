import type { Response, NextFunction } from "express";

import { CustomError } from "@/core/error";
import type { AuthRequest } from "@/core/middleware";
import { userRoles } from "@/core/interfaces";

export class RoleMiddleware {

    public static isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
        // Verificamos que el AuthMiddleware haya hecho su trabajo previo
        if (!req.userSession) {
            return next(CustomError.internalServer("User session missing. Verify AuthMiddleware execution order."));
        }

        // Validamos el rol exacto
        if (req.userSession.role !== userRoles.ADMIN) {
            return next(CustomError.forbidden("Access denied: Administrator privileges required"));
        }

        // Si es ADMIN, lo dejamos pasar al Controlador
        next();
    }

    public static isTeacher(req: AuthRequest, res: Response, next: NextFunction) {
        // Verificamos que el AuthMiddleware haya hecho su trabajo previo
        if (!req.userSession) {
            return next(CustomError.internalServer("User session missing. Verify AuthMiddleware execution order."));
        }

        // Validamos el rol exacto
        if (req.userSession.role !== userRoles.TEACHER) {
            return next(CustomError.forbidden("Access denied: Teacher privileges required"));
        }

        // Si es TEACHER, lo dejamos pasar al Controlador
        next();
    }
}