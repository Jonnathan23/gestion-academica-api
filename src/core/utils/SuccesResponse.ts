import type { Response } from "express";

export class SuccessResponse {
    private static readonly okStatus: number = 200;
    private static readonly okMessage: string = "Operation completed successfully";

    private static readonly createdStatus: number = 201;
    private static readonly createdMessage: string = "Resource created successfully";

    /**
     * @description Formats and sends a 200 OK response. Ideal for GET, PUT, PATCH or DELETE.
     * @param response Express Response object
     * @param message Descriptive message for the frontend
     * @param data Optional data to return
     */
    public static ok<T>(response: Response, message: string = this.okMessage, data?: T): void {
        response.status(this.okStatus).json({
            success: true,
            message: message,
            data: data || null,
        });
    }

    /**
     * @description Formats and sends a 201 Created response. Ideal for POST.
     * @param response Express Response object
     * @param message Descriptive message for the created resource
     * @param data Optional data (e.g., the ID of the new resource)
     */
    public static created<T>(response: Response, message: string = this.createdMessage, data?: T): void {
        response.status(this.createdStatus).json({
            success: true,
            message: message,
            data: data || null,
        });
    }
}
