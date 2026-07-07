import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from "sequelize";

import type { DatabaseErrorHandler, FormattedErrorResponse } from "@/core/interfaces/DatabaseErrorHandler.interface";
import { CustomPostgresDatabaseConnectionError } from "@/data/errors/CustomPostgresDatabaseError.error";

export class SequelizeErrorHandler implements DatabaseErrorHandler {
    public handleDatabaseError(error: unknown): FormattedErrorResponse | null {
        if (error instanceof UniqueConstraintError) {
            console.error("⚠️ [Missing Validation]: Unique constraint caught by Database.");
            console.error("Error details:", error);

            return {
                statusCode: 409,
                errors: [
                    {
                        message: "The request could not be processed with the provided information.",
                        path: "request_data",
                    },
                ],
            };
        }

        if (error instanceof ForeignKeyConstraintError) {
            console.warn("⚠️ [Missing Validation]: Foreign key constraint violation caught by Database.");
            console.error("Error details:", error);

            return {
                statusCode: 409,
                errors: [
                    {
                        message: "The operation could not be completed.",
                        path: "request_operation",
                    },
                ],
            };
        }

        if (error instanceof ValidationError) {
            console.warn("⚠️ [Missing Validation]: Null or type validation caught by Database.");
            console.error("Error details:", error);

            return {
                statusCode: 400,
                errors: [
                    {
                        message: "Some provided data is invalid.",
                        path: "request_data",
                    },
                ],
            };
        }

        const customError = CustomPostgresDatabaseConnectionError.getErrorDetails(error);

        return {
            statusCode: customError.statusCode,
            errors: [
                {
                    message: "An unexpected error occurred while processing the request.",
                    path: "internal_server",
                },
            ],
        };
    }
}
