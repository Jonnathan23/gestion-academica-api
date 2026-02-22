import { describe, test, expect, mock, spyOn, beforeEach } from "bun:test";
import type { Request, Response, NextFunction } from "express";

import type { DatabaseErrorHandler, FormattedErrorResponse } from "@/core/interfaces/DatabaseErrorHandler.interface";
import { CustomError } from "@/core/error";
import { createGlobalErrorHandler } from "@/core/middleware";



describe("GlobalErrorHandler Middleware Test Suite", () => {
    
    let requestMock: Request;
    let responseMock: Response;
    let nextFunctionMock: NextFunction;
    let databaseErrorHandlerMock: DatabaseErrorHandler;

    beforeEach(() => {
        requestMock = {} as Request;
        
        responseMock = {
            status: mock().mockReturnThis(),
            json: mock()
        } as unknown as Response;
        
        nextFunctionMock = mock();

        databaseErrorHandlerMock = {
            handleDatabaseError: mock()
        };
    });

    test("Should catch and format a CustomError correctly", () => {
        const customError = CustomError.badRequest("Invalid email format");
        const errorHandlerMiddleware = createGlobalErrorHandler(databaseErrorHandlerMock);

        errorHandlerMiddleware(customError, requestMock, responseMock, nextFunctionMock);

        expect(responseMock.status).toHaveBeenCalledWith(400);
        expect(responseMock.json).toHaveBeenCalledWith({
            errors: [{ message: "Invalid email format" }]
        });
        
        // CORRECCIÓN: Como el middleware hace "return" temprano, 
        // el manejador de base de datos NUNCA debe ser llamado.
        expect(databaseErrorHandlerMock.handleDatabaseError).not.toHaveBeenCalled();
    });

    test("Should delegate to DatabaseErrorHandler and format if it's a database error", () => {
        const fakeDatabaseError = new Error("Unique constraint failed");
        
        const databaseFormattedResponse: FormattedErrorResponse = {
            statusCode: 409,
            errors: [{ message: "Email already exists", path: "email" }]
        };
        (databaseErrorHandlerMock.handleDatabaseError as ReturnType<typeof mock>).mockReturnValue(databaseFormattedResponse);

        const errorHandlerMiddleware = createGlobalErrorHandler(databaseErrorHandlerMock);

        errorHandlerMiddleware(fakeDatabaseError, requestMock, responseMock, nextFunctionMock);

        expect(responseMock.status).toHaveBeenCalledWith(409);
        expect(responseMock.json).toHaveBeenCalledWith({
            errors: databaseFormattedResponse.errors
        });
    });

    test("Should fallback to 500 Internal Server Error for completely unknown errors", () => {
        const unknownError = new TypeError("Cannot read properties of undefined");
        
        (databaseErrorHandlerMock.handleDatabaseError as ReturnType<typeof mock>).mockReturnValue(null);

        const errorHandlerMiddleware = createGlobalErrorHandler(databaseErrorHandlerMock);

        // CORRECCIÓN: Silenciamos el console.error interceptándolo directamente
        const consoleSpy = spyOn(console, "error").mockImplementation(() => {});

        errorHandlerMiddleware(unknownError, requestMock, responseMock, nextFunctionMock);

        expect(responseMock.status).toHaveBeenCalledWith(500);
        expect(responseMock.json).toHaveBeenCalledWith({
            errors: [{ message: "Internal server error, please try again later" }]
        });

        // Limpiamos el espía para que no afecte a futuros tests
        consoleSpy.mockRestore();
    });
});