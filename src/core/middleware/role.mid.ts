import type { Response, NextFunction } from "express";

import { CustomError } from "@/core/error";
import type { AuthRequest } from "@/core/middleware";
import { rolePermissionsMapping, type SystemPermission } from "@/core/constants";

export class RoleMiddleware {

    /**
     * Middleware de autorización granular.
     * @param requiredPermissions Arreglo de permisos necesarios para acceder a la ruta.
     */
    public static requirePermissions(requiredPermissions: SystemPermission[]) {

        return (req: AuthRequest, res: Response, next: NextFunction) => {

            if (!req.userSession) {
                return next(CustomError.internalServer("User session missing. Verify AuthMiddleware execution order."));
            }

            const currentUserRole = req.userSession.role;

            const userAssignedPermissions = rolePermissionsMapping[currentUserRole] || [];

            const hasRequiredPermissions = requiredPermissions.every(permission =>
                userAssignedPermissions.includes(permission)
            );

            if (!hasRequiredPermissions) {
                return next(CustomError.forbidden("Access denied: You lack the required permissions for this action."));
            }

            next();
        };
    }
}