export class CustomError extends Error {
    public readonly statusCode: number;
    public readonly errors: Array<{ message: string; path?: string }>;

    private constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;

        this.errors = [{ message: message }];

        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
         * @description Crea un error de tipo 400 Bad Request (Petición incorrecta o datos inválidos)
         * @param message Mensaje de error
         * @returns CustomError
         */
    public static badRequest(message: string): CustomError {
        return new CustomError(400, message);
    }

    /**
     * @description Crea un error de tipo 401 Unauthorized (El usuario no ha iniciado sesión o el token es inválido)
     * @param message Mensaje de error
     * @returns CustomError
     */
    public static unauthorized(message: string): CustomError {
        return new CustomError(401, message);
    }

    /**
     * @description Crea un error de tipo 403 Forbidden (El usuario inició sesión, pero no tiene permisos para esta acción)
     * @param message Mensaje de error
     * @returns CustomError
     */
    public static forbidden(message: string): CustomError {
        return new CustomError(403, message);
    }

    /**
     * @description Crea un error de tipo 404 Not Found (El recurso, como un estudiante o módulo, no existe)
     * @param message Mensaje de error
     * @returns CustomError
     */
    public static notFound(message: string): CustomError {
        return new CustomError(404, message);
    }

    /**
     * @description Crea un error de tipo 409 Conflict (Conflicto de estado, ej. intentar registrar un email que ya existe)
     * @param message Mensaje de error
     * @returns CustomError
     */
    public static conflict(message: string): CustomError {
        return new CustomError(409, message);
    }

    /**
     * @description Crea un error de tipo 500 Internal Server Error (Fallo interno en la lógica de programación del servidor)
     * @param message Mensaje de error
     * @returns CustomError
     */
    public static internalServer(message: string = 'Internal server error'): CustomError {
        return new CustomError(500, message);
    }

    /**
     * @description Crea un error de tipo 503 Service Unavailable (El servidor está arriba, pero un servicio externo o la BD falló)
     * @param message Mensaje de error
     * @returns CustomError
     */
    public static serviceUnavailable(message: string = 'Service is currently unavailable'): CustomError {
        return new CustomError(503, message);
    }
}