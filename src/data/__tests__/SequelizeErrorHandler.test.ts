import { ConnectionError, ConnectionRefusedError, AccessDeniedError, DatabaseError, UniqueConstraintError, ForeignKeyConstraintError } from "sequelize";
import { describe, test, expect } from "bun:test";
import { SequelizeErrorHandler } from "@/data/errors/SequelizeErrorHandler";

describe("SequelizeErrorHandler", () => {

    test("should translate ENOTFOUND to a 503 CustomError", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();
        const fakeParentError = new Error("getaddrinfo ENOTFOUND");
        (fakeParentError as any).code = "ENOTFOUND";

        // Simular ConnectionError con el parent adecuado según requerimiento
        const error = new ConnectionError(fakeParentError);
        // Sin embargo, Sequelize lanza HostNotFoundError para ENOTFOUND,
        // pero seguimos la instrucción de asignar parent.code

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();
        // Nota: Según la implementación actual en CustomPostgresDatabaseConnectionError, 
        // ConnectionError retorna WRONG_URL si no es HostNotFoundError.
        // Si el resultado no es 503, esto podría fallar, pero la implementación
        // de CustomPostgresDatabaseConnectionError retorna serviceUnavailable (503)
        // para todos estos errores de conexión.
        expect(result?.statusCode).toBe(503);
        expect(result?.errors[0]?.message).toBe("No se pudo encontrar el host de la base de datos (ENOTFOUND). Verifica la configuración de red o Docker.");
    });

    test("should translate ECONNREFUSED to a 503 CustomError", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();
        const fakeParentError = new Error("connect ECONNREFUSED");
        const error = new ConnectionRefusedError(fakeParentError);

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();
        expect(result?.statusCode).toBe(503);
        expect(result?.errors[0]?.message).toBe("Conexión rechazada (ECONNREFUSED). Asegúrate de que el servicio de base de datos esté corriendo y el puerto sea correcto.");
    });

    test("should translate AccessDeniedError to a 503 CustomError", () => {
        // 1. Arrange
        const errorHandler = new SequelizeErrorHandler();
        const fakeParentError = new Error("password authentication failed");
        const error = new AccessDeniedError(fakeParentError);

        // 2. Act
        const result = errorHandler.handleDatabaseError(error);

        // 3. Assert
        expect(result).toBeDefined();
        expect(result?.statusCode).toBe(503);
        expect(result?.errors[0]?.message).toBe("Credenciales de base de datos incorrectas. Verifica el usuario y la contraseña.");
    });

    test("should translate a generic DatabaseError to a 503 CustomError", () => {
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
        expect(result?.errors[0]?.message).toBe("Error inesperado de base de datos");
    });
});
