import type { Request, Response, NextFunction } from "express";


export class VerifyUUID {
    public static validate(request: Request, response: Response, next: NextFunction, identifier: string): void {
        const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (uuidRegex.test(identifier)) {
            next();
        } else {
            /* * Si el formato es incorrecto, cortamos el flujo aquí mismo 
             * y respondemos al cliente.
             */
            response.status(400).json({
                error: `Your Item is not valid`
            });
        }
    }
}