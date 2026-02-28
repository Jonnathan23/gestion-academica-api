import type { NextFunction, Request, Response } from "express";

import { CustomError } from "@/core/error";
import type { DatabaseErrorHandler } from "@/core/interfaces/DatabaseErrorHandler.interface";



// Función de orden superior que inyecta la dependencia
export const createGlobalErrorHandler = (databaseErrorHandler: DatabaseErrorHandler) => {
    
    return (error: unknown, request: Request, response: Response, nextFunction: NextFunction) => {
        // Errores de Dominio / Negocio        
        if (error instanceof CustomError) {
            return response.status(error.statusCode).json({ 
                errors: error.errors 
            });
        }

        // Errores delegados a la base de datos
        const mappedDatabaseError = databaseErrorHandler.handleDatabaseError(error);
        if (mappedDatabaseError) {
            return response.status(mappedDatabaseError.statusCode).json({ 
                errors: mappedDatabaseError.errors 
            });
        }

        // Fallback Global (Error 500)
        console.error('💥 [UNHANDLED INTERNAL ERROR]:', error);
        const internalError = CustomError.internalServer('Internal server error, please try again later');
        
        return response.status(internalError.statusCode).json({
            errors: internalError.errors 
        });
    };
};