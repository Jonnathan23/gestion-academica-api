import {
    ConnectionError,
    ConnectionRefusedError,
    AccessDeniedError,
    DatabaseError,
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
} from "sequelize";

import { describe, test, expect } from "bun:test";

import { SequelizeErrorHandler } from "@/data/errors/SequelizeErrorHandler";

describe("SequelizeErrorHandler", () => {
    test("should return a generic safe message for ENOTFOUND errors", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();

        const fakeParentError = new Error("getaddrinfo ENOTFOUND");
        (fakeParentError as any).code = "ENOTFOUND";

        const error = new ConnectionError(fakeParentError);

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();

        expect(result?.statusCode).toBe(503);

        expect(result?.errors[0]?.message).toBe("An unexpected error occurred while processing the request.");
    });

    test("should return a generic safe message for ECONNREFUSED errors", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();

        const fakeParentError = new Error("connect ECONNREFUSED");

        const error = new ConnectionRefusedError(fakeParentError);

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();

        expect(result?.statusCode).toBe(503);

        expect(result?.errors[0]?.message).toBe("An unexpected error occurred while processing the request.");
    });

    test("should return a generic safe message for AccessDeniedError", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();

        const fakeParentError = new Error("password authentication failed");

        const error = new AccessDeniedError(fakeParentError);

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();

        expect(result?.statusCode).toBe(503);

        expect(result?.errors[0]?.message).toBe("An unexpected error occurred while processing the request.");
    });

    test("should return a generic safe message for generic DatabaseError", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();

        const fakeParentError = new Error("Some random DB error") as any;

        fakeParentError.sql = "SELECT * FROM nothing;";

        const error = new DatabaseError(fakeParentError);

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();

        expect(result?.statusCode).toBe(503);

        expect(result?.errors[0]?.message).toBe("An unexpected error occurred while processing the request.");
    });

    test("should return a generic safe message for UniqueConstraintError", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();

        const error = new UniqueConstraintError({
            errors: [],
        });

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();

        expect(result?.statusCode).toBe(409);

        expect(result?.errors[0]?.message).toBe("The request could not be processed with the provided information.");

        expect(result?.errors[0]?.path).toBe("request_data");
    });

    test("should return a generic safe message for ForeignKeyConstraintError", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();

        const error = new ForeignKeyConstraintError({
            fields: {},
            table: "users",
            value: "1",
        });

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();

        expect(result?.statusCode).toBe(409);

        expect(result?.errors[0]?.message).toBe("The operation could not be completed.");

        expect(result?.errors[0]?.path).toBe("request_operation");
    });

    test("should return a generic safe message for ValidationError", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();

        const error = new ValidationError("Validation error", []);

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();

        expect(result?.statusCode).toBe(400);

        expect(result?.errors[0]?.message).toBe("Some provided data is invalid.");

        expect(result?.errors[0]?.path).toBe("request_data");
    });
});
