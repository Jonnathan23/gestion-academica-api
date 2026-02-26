import jwt, { type SignOptions } from 'jsonwebtoken';
import { environmentVariables } from "@/core/config";



const JWT_SEED = environmentVariables.JWT_SEED
const JWT_STUDENT_SEED = environmentVariables.JWT_STUDENT_SEED

export const JwtAdapter = {

    
    //*  TOKENS DE IDENTIDAD (Administradores, Profesores, Sistema)    
    
    async generateToken(payload: Object, duration: SignOptions['expiresIn'] = '20h'): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (error, token) => {
                if (error) return resolve(null);
                resolve(token!);
            });
        });
    },

    async validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (error, decoded) => {
                if (error) return resolve(null);
                resolve(decoded as T);
            });
        });
    },

    
    //*  TOKENS DE ESTUDIANTES (ClassTrack - Sesiones Efímeras)    

    async generateStudentToken(payload: Object, duration: SignOptions['expiresIn'] = '12h'): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_STUDENT_SEED, { expiresIn: duration }, (error, token) => {
                if (error) return resolve(null);
                resolve(token!);
            });
        });
    },

    async validateStudentToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_STUDENT_SEED, (error, decoded) => {
                if (error) return resolve(null);
                resolve(decoded as T);
            });
        });
    }
}