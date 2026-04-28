import {
    AccessDeniedError, ConnectionError, ConnectionRefusedError, DatabaseError,
    ForeignKeyConstraintError, HostNotFoundError, UniqueConstraintError
} from "sequelize";

import { ColorsAdapter } from "@/core/utils";
import { CustomError } from "@/core/error";

export class CustomPostgresDatabaseConnectionError extends Error {
    private static databaseKindErrors = {
        ACCESS_DENIED: "Credenciales de base de datos incorrectas. Verifica el usuario y la contraseña.",
        WRONG_URL: "La URL de la base de datos es incorrecta o malformada.",
        HOST_NOT_FOUND: "No se pudo encontrar el host de la base de datos (ENOTFOUND). Verifica la configuración de red o Docker.",
        CONNECTION_REFUSED: "Conexión rechazada (ECONNREFUSED). Asegúrate de que el servicio de base de datos esté corriendo y el puerto sea correcto.",
        DATABASE_NOT_FOUND: "La base de datos especificada no existe en el servidor.",
        UNEXPECTED_ERROR: "Error inesperado de base de datos",
        PERSISTENCE_ERROR: "Error de persistencia: violación de restricciones de integridad."
    }
    private constructor(message: string) {
        super(message);
        this.name = "CustomDatabaseConnectionError";
    }

    private static getErrorMessage(error: unknown): string {
        if (error instanceof AccessDeniedError) return this.databaseKindErrors.ACCESS_DENIED;
        if (error instanceof HostNotFoundError) return this.databaseKindErrors.HOST_NOT_FOUND;
        if (error instanceof ConnectionRefusedError) return this.databaseKindErrors.CONNECTION_REFUSED;
        if (error instanceof DatabaseError) return this.databaseKindErrors.UNEXPECTED_ERROR;
        if (error instanceof ConnectionError) {
            if ((error as any).parent?.code === 'ENOTFOUND') return this.databaseKindErrors.HOST_NOT_FOUND;
            return this.databaseKindErrors.WRONG_URL;
        }
        if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError) return this.databaseKindErrors.PERSISTENCE_ERROR;
        return this.databaseKindErrors.UNEXPECTED_ERROR;
    }

    public static getErrorDetails(error: unknown): CustomError {
        const message = this.getErrorMessage(error);       

        console.log(ColorsAdapter.setYellow(`[DATABASE ERROR]: ${message}`));

        return CustomError.serviceUnavailable(message);
    }
}
