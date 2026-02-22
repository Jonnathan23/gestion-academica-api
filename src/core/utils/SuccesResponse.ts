import type { Response } from 'express';
///*
//export class SuccessResponse {
//    
//    /**
//     * @description Formatea y envía una respuesta 200 OK. Ideal para GET, PUT, PATCH o DELETE.
//     * @param response Objeto Response de Express
//     * @param message Mensaje descriptivo para el frontend
//     * @param data Datos opcionales a retornar (si es un PUT que solo necesita mensaje, se omite)
//     */
//    public static ok<T>(response: Response, message: string = 'Operation completed successfully', data?: T): void {
//        response.status(200).json({
//            success: true,
//            message: message,
//            data: data || null
//        });
//    }
//
//    /**
//     * @description Formatea y envía una respuesta 201 Created. Ideal para POST (creación de recursos).
//     * @param response Objeto Response de Express
//     * @param message Mensaje descriptivo del recurso creado
//     * @param data Datos opcionales (ej. el ID del nuevo recurso creado)
//     */
//    public static created<T>(response: Response, message: string = 'Resource created successfully', data?: T): void {
//        response.status(201).json({
//            success: true,
//            message: message,
//            data: data || null
//        });
//    }
//}




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