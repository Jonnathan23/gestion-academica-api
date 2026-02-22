export interface FormattedErrorResponse {
    statusCode: number;
    errors: Array<{ message: string; path?: string }>;
}

export interface DatabaseErrorHandler {
    handleDatabaseError(error: unknown): FormattedErrorResponse | null;
}