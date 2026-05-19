import {
    AccessDeniedError,
    ConnectionError,
    ConnectionRefusedError,
    DatabaseError,
    ForeignKeyConstraintError,
    HostNotFoundError,
    UniqueConstraintError,
} from "sequelize";

import { ColorsAdapter } from "@/core/utils";
import { CustomError } from "@/core/error";

export class CustomPostgresDatabaseConnectionError extends Error {
    private static databaseKindErrors = {
        AccessDenied: "Credenciales de base de datos incorrectas. Verifica el usuario y la contraseña.",
        WrongUrl: "La URL de la base de datos es incorrecta o malformada.",
        HostNotFound: "No se pudo encontrar el host de la base de datos (ENOTFOUND). Verifica la configuración de red o Docker.",
        ConnectionRefused:
            "Conexión rechazada (ECONNREFUSED). Asegúrate de que el servicio de base de datos esté corriendo y el puerto sea correcto.",
        DatabaseNotFound: "La base de datos especificada no existe en el servidor.",
        UnexpectedError: "Error inesperado de base de datos",
        PersistenceError: "Error de persistencia: violación de restricciones de integridad.",
    };
    private constructor(message: string) {
        super(message);
        this.name = "CustomDatabaseConnectionError";
    }

    private static getErrorMessage(error: unknown): string {
        if (error instanceof AccessDeniedError) return this.databaseKindErrors.AccessDenied;
        if (error instanceof HostNotFoundError) return this.databaseKindErrors.HostNotFound;
        if (error instanceof ConnectionRefusedError) return this.databaseKindErrors.ConnectionRefused;
        if (error instanceof DatabaseError) return this.databaseKindErrors.UnexpectedError;
        if (error instanceof ConnectionError) {
            if ((error as any).parent?.code === "ENOTFOUND") return this.databaseKindErrors.HostNotFound;
            return this.databaseKindErrors.WrongUrl;
        }
        if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError)
            return this.databaseKindErrors.PersistenceError;
        return this.databaseKindErrors.UnexpectedError;
    }

    public static getErrorDetails(error: unknown): CustomError {
        const message = this.getErrorMessage(error);

        console.error(ColorsAdapter.setYellow(`[DATABASE ERROR]: ${message}`));
        console.error(ColorsAdapter.setRedBold(`[DATABASE ERROR RAW]: ${error}`));

        return CustomError.serviceUnavailable("An unexpected error occurred while processing the request.");
    }
}
