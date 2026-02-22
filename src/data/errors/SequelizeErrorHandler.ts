import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError, DatabaseError } from 'sequelize';

import type { DatabaseErrorHandler, FormattedErrorResponse } from '@/core/interfaces/DatabaseErrorHandler.interface';



export class SequelizeErrorHandler implements DatabaseErrorHandler {
    public handleDatabaseError(error: unknown): FormattedErrorResponse | null {

        if (error instanceof UniqueConstraintError) {
            console.warn('⚠️ [Missing Validation]: Unique constraint caught by Database.');
            return {
                statusCode: 409,
                errors: error.errors.map(validationErrorItem => ({
                    message: `The value for ${validationErrorItem.path} already exists in the system.`,
                    path: validationErrorItem.path || 'unknown'
                }))
            };
        }

        if (error instanceof ForeignKeyConstraintError) {
            console.warn('⚠️ [Missing Validation]: Foreign key constraint violation caught by Database.');
            return {
                statusCode: 409,
                errors: [{
                    message: 'This operation violates relationship constraints in the database.',
                    path: 'database_relationship'
                }]
            };
        }

        if (error instanceof ValidationError) {
            console.warn('⚠️ [Missing Validation]: Null or type validation caught by Database.');
            return {
                statusCode: 400,
                errors: error.errors.map(validationErrorItem => ({
                    message: validationErrorItem.message,
                    path: validationErrorItem.path || 'unknown'
                }))
            };
        }

        if (error instanceof DatabaseError) {
            console.error('💥 [CRITICAL DATABASE ERROR]:', error.message);
            return {
                statusCode: 503,
                errors: [{ message: 'Database service encountered an unexpected error.' }]
            };
        }

        // Si no es un error de Sequelize, retornamos null para que el middleware global decida qué hacer
        return null;
    }
}