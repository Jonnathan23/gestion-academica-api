import jwt, { type SignOptions } from "jsonwebtoken";
import { environmentVariables } from "@/core/config";

export class JwtAdapter {
    //*  TOKENS DE IDENTIDAD (Administradores, Profesores, Sistema)

    public static async generateToken(payload: Object, duration: SignOptions["expiresIn"] = "20h"): Promise<string | null> {
        const jwtSeed = environmentVariables.JwtSeed;

        return new Promise((resolve) => {
            jwt.sign(payload, jwtSeed, { expiresIn: duration }, (error, token) => {
                if (error) return resolve(null);
                resolve(token!);
            });
        });
    }

    public static async validateToken<T>(token: string): Promise<T | null> {
        const jwtSeed = environmentVariables.JwtSeed;
        return new Promise((resolve) => {
            jwt.verify(token, jwtSeed, (error, decoded) => {
                if (error) return resolve(null);
                resolve(decoded as T);
            });
        });
    }

    //*  TOKENS DE ESTUDIANTES (ClassTrack - Sesiones Efímeras)

    public static async generateStudentToken(payload: Object, duration: SignOptions["expiresIn"] = "12h"): Promise<string | null> {
        const jwtStudentSeed = environmentVariables.JwtStudentSeed;

        return new Promise((resolve) => {
            jwt.sign(payload, jwtStudentSeed, { expiresIn: duration }, (error, token) => {
                if (error) return resolve(null);
                resolve(token!);
            });
        });
    }

    public static async validateStudentToken<T>(token: string): Promise<T | null> {
        const jwtStudentSeed = environmentVariables.JwtStudentSeed;
        return new Promise((resolve) => {
            jwt.verify(token, jwtStudentSeed, (error, decoded) => {
                if (error) return resolve(null);
                resolve(decoded as T);
            });
        });
    }
}
