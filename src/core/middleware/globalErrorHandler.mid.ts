import type { NextFunction, Request, Response } from "express";

import { CustomError } from "@/core/error";
import type { DatabaseErrorHandler } from "@/core/interfaces/DatabaseErrorHandler.interface";

interface FormattedErrorResponse {
    message: string;
    path?: string | undefined;
}

interface ErrorResponse {
    errors: FormattedErrorResponse[];
}



// Función de orden superior que inyecta la dependencia
export const createGlobalErrorHandler = (databaseErrorHandler: DatabaseErrorHandler) => {

    return (error: unknown, request: Request, response: Response, nextFunction: NextFunction) => {
        // Errores de Dominio / Negocio        
        if (error instanceof CustomError) {
            const errorResponse: ErrorResponse = {
                errors: error.errors
            }
            return response.status(error.statusCode).json(errorResponse);
        }

        // Errores delegados a la base de datos
        const mappedDatabaseError = databaseErrorHandler.handleDatabaseError(error);
        if (mappedDatabaseError) {
            const errorResponse: ErrorResponse = {
                errors: mappedDatabaseError.errors
            }
            return response.status(mappedDatabaseError.statusCode).json(errorResponse);
        }

        // Fallback Global (Error 500)
        console.error('💥 [UNHANDLED INTERNAL ERROR]:', error);
        const internalError = CustomError.internalServer('Internal server error, please try again later');
        const errorResponse: ErrorResponse = {
            errors: internalError.errors
        }
        return response.status(internalError.statusCode).json(errorResponse);
    };
};