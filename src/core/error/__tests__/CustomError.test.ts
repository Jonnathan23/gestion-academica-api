import { describe, test, expect } from "bun:test";
import { CustomError } from "@/core/error";

describe("CustomError Class Test Suite", () => {
    
    test("Should create a 400 Bad Request error correctly", () => {
        const expectedMessage = "Invalid input data provided by the client";
        const badRequestError = CustomError.badRequest(expectedMessage);

        expect(badRequestError).toBeInstanceOf(CustomError);
        expect(badRequestError.statusCode).toBe(400);
        expect(badRequestError.errors).toBeArray();        

        expect(badRequestError.errors).toEqual([{ message: expectedMessage }]);
    });

    test("Should create a 401 Unauthorized error correctly", () => {
        const expectedMessage = "Invalid token provided";
        const unauthorizedError = CustomError.unauthorized(expectedMessage);

        expect(unauthorizedError.statusCode).toBe(401);
        expect(unauthorizedError.errors).toEqual([{ message: expectedMessage }]);
    });

    test("Should create a 500 Internal Server error with the default message", () => {
        const internalServerError = CustomError.internalServer();

        expect(internalServerError.statusCode).toBe(500);
        expect(internalServerError.errors).toEqual([{ message: "Internal server error" }]);
    });

    test("Should override the 500 Internal Server error message if provided", () => {
        const customInternalMessage = "Database connection timed out";
        const internalServerError = CustomError.internalServer(customInternalMessage);

        expect(internalServerError.statusCode).toBe(500);
        expect(internalServerError.errors).toEqual([{ message: customInternalMessage }]);
    });
});