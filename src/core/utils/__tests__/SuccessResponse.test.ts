import type { Response } from "express";
import { describe, test, expect, mock } from "bun:test";

import { SuccessResponse } from "@/core/utils";



describe("SuccessResponse Utility Test Suite", () => {
    
    test("Should format a 200 OK response correctly with default data", () => {
        // 1. Arrange: Creamos un "doble de riesgo" (mock) del objeto Response de Express
        const responseMock = {
            status: mock().mockReturnThis(), // Permite encadenar .status(200).json(...)
            json: mock()
        } as unknown as Response;

        const expectedMessage = "Operation completed successfully";

        // 2. Act: Ejecutamos el método estático
        SuccessResponse.ok(responseMock, expectedMessage);

        // 3. Assert: Verificamos que se haya llamado a los métodos de Express con los datos correctos
        expect(responseMock.status).toHaveBeenCalledWith(200);
        expect(responseMock.json).toHaveBeenCalledWith({
            success: true,
            message: expectedMessage,
            data: null
        });
    });

    test("Should format a 201 Created response correctly with payload data", () => {
        const responseMock = {
            status: mock().mockReturnThis(),
            json: mock()
        } as unknown as Response;

        const expectedMessage = "Student registered";
        const payloadData = { studentId: "123e4567-e89b-12d3-a456-426614174000" };

        SuccessResponse.created(responseMock, expectedMessage, payloadData);

        expect(responseMock.status).toHaveBeenCalledWith(201);
        expect(responseMock.json).toHaveBeenCalledWith({
            success: true,
            message: expectedMessage,
            data: payloadData
        });
    });
});