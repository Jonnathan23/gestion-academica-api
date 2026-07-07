import type { Request, Response, NextFunction } from "express";
import { CustomError } from "@/core/error/customError.error";

export class VerifyUUID {
    public static validate(request: Request, response: Response, next: NextFunction, identifier: string): void {
        const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (uuidRegex.test(identifier)) {
            next();
        } else {
            /* * Si el formato es incorrecto, delegamos el error a nuestro manejador global
             * usando nuestra clase CustomError.
             */
            next(CustomError.badRequest(`Invalid Item`));
        }
    }
}
