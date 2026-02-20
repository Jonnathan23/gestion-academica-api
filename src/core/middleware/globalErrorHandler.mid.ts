import { CustomError } from "@/core/error";
import type { NextFunction, Request, Response } from "express";


export const globalErrorHandler = (error: unknown, request: Request, response: Response, nextFunction: NextFunction) => {
    console.error('CRITICAL ERROR 💥:', error);

    if (error instanceof CustomError) {
        return response.status(error.statusCode).json({
            errors: error.errors
        });
    }

    const internalError = CustomError.internalServer('Internal server error, please try again later');

    return response.status(internalError.statusCode).json({
        errors: internalError.errors
    });
};