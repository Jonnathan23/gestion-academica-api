import type { Response } from 'express';

export const SuccessResponse = {
    
    /**
     * @description Formats and sends a 200 OK response. Ideal for GET, PUT, PATCH or DELETE.
     * @param response Express Response object
     * @param message Descriptive message for the frontend
     * @param data Optional data to return
     */
    ok<T>(response: Response, message: string = 'Operation completed successfully', data?: T): void {
        response.status(200).json({
            success: true,
            message: message,
            data: data || null
        });
    },

    /**
     * @description Formats and sends a 201 Created response. Ideal for POST.
     * @param response Express Response object
     * @param message Descriptive message for the created resource
     * @param data Optional data (e.g., the ID of the new resource)
     */
    created<T>(response: Response, message: string = 'Resource created successfully', data?: T): void {
        response.status(201).json({
            success: true,
            message: message,
            data: data || null
        });
    }
};