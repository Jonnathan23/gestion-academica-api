import { describe, test, expect, mock, spyOn } from "bun:test";
import { Router } from "express";
import type { CorsConfig } from "@/core/config";

import type { DatabaseErrorHandler } from "@/core/interfaces/DatabaseErrorHandler.interface";
import type { SwaggerConfiguration } from "@/core/config/swagger";
import { Server } from "@/core/server";




describe("Server Class Test Suite", () => {

    test("Should initialize the server with the correct port and configurations", async () => {

        // 1. Arrange: Preparamos dependencias falsas (Dummies)
        const listeningPort = 8080;
        const routerDummy = Router();

        const corsConfigMock = {
            corsOptions: { origin: "*" }
        } as unknown as CorsConfig;

        const databaseErrorHandlerMock = {
            handleDatabaseError: mock()
        } as DatabaseErrorHandler;

        const swaggerConfigurationMock = {
            serve: mock(),
            setup: mock().mockReturnValue(mock())
        } as unknown as SwaggerConfiguration;

        // Instanciamos nuestro servidor
        const serverInstance = new Server({
            port: listeningPort,
            routes: routerDummy,
            cors: corsConfigMock,
            databaseErrorHandler: databaseErrorHandlerMock,
            documentation: swaggerConfigurationMock
        });

        // ¡EL TRUCO DE MAGIA!: Interceptamos el método listen de Express para que no abra el puerto real
        const listenSpy = spyOn(serverInstance.app, "listen").mockImplementation(((port: number, callback?: () => void) => {
            if (typeof callback === "function") {
                callback(); // Ejecutamos el console.log interno para completar la rama de cobertura
            }
            return {} as any;
        }) as any);

        // 2. Act: Iniciamos el servidor
        await serverInstance.start();

        // 3. Assert: Verificamos que la aplicación de Express haya recibido las configuraciones
        expect(serverInstance.app).toBeDefined();

        // Verificamos que se haya intentado escuchar en el puerto correcto (8080)
        expect(listenSpy).toHaveBeenCalled();
        expect(listenSpy.mock.calls[0]?.[0]).toBe(listeningPort);

        // Limpiamos el espía
        listenSpy.mockRestore();
    });
});