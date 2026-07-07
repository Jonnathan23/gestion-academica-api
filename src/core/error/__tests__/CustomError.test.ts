import { describe, test, expect } from "bun:test";
import { CustomError } from "@/core/error/customError.error";

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

    test("Should create a 403 Forbidden error correctly", () => {
        const expectedMessage = "You do not have permission to access this resource";
        const forbiddenError = CustomError.forbidden(expectedMessage);

        expect(forbiddenError).toBeInstanceOf(CustomError);
        expect(forbiddenError.statusCode).toBe(403);
        expect(forbiddenError.errors).toEqual([{ message: expectedMessage }]);
    });

    test("Should create a 404 Not Found error correctly", () => {
        const expectedMessage = "The requested student record was not found";
        const notFoundError = CustomError.notFound(expectedMessage);

        expect(notFoundError).toBeInstanceOf(CustomError);
        expect(notFoundError.statusCode).toBe(404);
        expect(notFoundError.errors).toEqual([{ message: expectedMessage }]);
    });

    test("Should create a 409 Conflict error correctly", () => {
        const expectedMessage = "A user with that email address already exists";
        const conflictError = CustomError.conflict(expectedMessage);

        expect(conflictError).toBeInstanceOf(CustomError);
        expect(conflictError.statusCode).toBe(409);
        expect(conflictError.errors).toEqual([{ message: expectedMessage }]);
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

    test("Should create a 503 Service Unavailable error with the default message", () => {
        const serviceUnavailableError = CustomError.serviceUnavailable();

        expect(serviceUnavailableError).toBeInstanceOf(CustomError);
        expect(serviceUnavailableError.statusCode).toBe(503);
        expect(serviceUnavailableError.errors).toEqual([{ message: "Service is currently unavailable" }]);
    });

    test("Should override the 503 Service Unavailable error message if provided", () => {
        const customUnavailableMessage = "The payment gateway is temporarily down";
        const serviceUnavailableError = CustomError.serviceUnavailable(customUnavailableMessage);

        expect(serviceUnavailableError.statusCode).toBe(503);
        expect(serviceUnavailableError.errors).toEqual([{ message: customUnavailableMessage }]);
    });

    test("Should be an instance of the built-in Error class", () => {
        const anyError = CustomError.badRequest("Instance check");

        expect(anyError).toBeInstanceOf(Error);
    });
});
