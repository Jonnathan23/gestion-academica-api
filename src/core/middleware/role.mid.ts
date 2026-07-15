import type { Response, NextFunction } from "express";
import { CustomError } from "@/core/error/customError.error";
import type { AuthRequest } from "@/core/middleware/auth.mid";
import { rolePermissionsMapping, type SystemPermission } from "@/core/constants/permissions";

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

            const hasRequiredPermissions = requiredPermissions.every((permission) => userAssignedPermissions.includes(permission));

            if (!hasRequiredPermissions) {
                return next(CustomError.forbidden("Access denied: You lack the required permissions for this action."));
            }

            next();
        };
    }

    /**
     * Middleware de autorización híbrida (Compartida).
     * @param requiredPermissions Arreglo de permisos necesarios (aplicable si es usuario regular).
     */
    public static requireSharedPermissions(requiredPermissions: SystemPermission[]) {
        return (req: AuthRequest, res: Response, next: NextFunction) => {
            if (req.studentSession) {
                return next();
            }

            if (!req.userSession) {
                return next(CustomError.internalServer("User and Student sessions are missing. Verify AuthMiddleware execution order."));
            }

            const currentUserRole = req.userSession.role;
            const userAssignedPermissions = rolePermissionsMapping[currentUserRole] || [];

            const hasRequiredPermissions = requiredPermissions.every((permission) => userAssignedPermissions.includes(permission));

            if (!hasRequiredPermissions) {
                return next(CustomError.forbidden("Access denied: You lack the required permissions for this action."));
            }

            next();
        };
    }
}
