import type { Response } from "express";
import { describe, test, expect, mock } from "bun:test";
import { SuccessResponse } from "@/core/utils/success-response";

describe("SuccessResponse Utility Test Suite", () => {
    describe("OK method", () => {
        test("Should format a 200 OK response correctly with default data", () => {
            const responseMock = {
                status: mock().mockReturnThis(),
                json: mock(),
            } as unknown as Response;

            const expectedMessage = "Operation completed successfully";

            SuccessResponse.ok(responseMock, expectedMessage);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.json).toHaveBeenCalledWith({
                success: true,
                message: expectedMessage,
                data: null,
            });
        });

        test("Should format a 200 OK response correctly with payload data", () => {
            const responseMock = {
                status: mock().mockReturnThis(),
                json: mock(),
            } as unknown as Response;

            const expectedMessage = "Student profile retrieved";
            const payloadData = { studentId: "abc-123", fullName: "Jane Doe" };

            SuccessResponse.ok(responseMock, expectedMessage, payloadData);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.json).toHaveBeenCalledWith({
                success: true,
                message: expectedMessage,
                data: payloadData,
            });
        });

        test("Should format a 200 OK response with the default message when none is provided", () => {
            const responseMock = {
                status: mock().mockReturnThis(),
                json: mock(),
            } as unknown as Response;

            SuccessResponse.ok(responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.json).toHaveBeenCalledWith({
                success: true,
                message: "Operation completed successfully",
                data: null,
            });
        });
    });

    describe("Created method", () => {
        test("Should format a 201 Created response correctly with payload data", () => {
            const responseMock = {
                status: mock().mockReturnThis(),
                json: mock(),
            } as unknown as Response;

            const expectedMessage = "Student registered";
            const payloadData = { studentId: "123e4567-e89b-12d3-a456-426614174000" };

            SuccessResponse.created(responseMock, expectedMessage, payloadData);

            expect(responseMock.status).toHaveBeenCalledWith(201);
            expect(responseMock.json).toHaveBeenCalledWith({
                success: true,
                message: expectedMessage,
                data: payloadData,
            });
        });

        test("Should format a 201 Created response with the default message when none is provided", () => {
            const responseMock = {
                status: mock().mockReturnThis(),
                json: mock(),
            } as unknown as Response;

            SuccessResponse.created(responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(201);
            expect(responseMock.json).toHaveBeenCalledWith({
                success: true,
                message: "Resource created successfully",
                data: null,
            });
        });
    });
});
