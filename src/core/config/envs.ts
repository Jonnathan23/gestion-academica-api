import { get } from "env-var";
import { ColorsAdapter } from "@/core/utils"; // Aprovechamos tu adaptador de colores

interface EnvironmentVariables {
    listeningPort: number;
    adminDeskUrl: string;
    classTrackUrl: string;
    databaseUrl: string;
    nodeEnvironment: string;
    documentationUrl: string;
    JWT_SEED: string;
    JWT_STUDENT_SEED: string;
    argumentValue: string;
}

let validatedEnvs: EnvironmentVariables;

try {

    validatedEnvs = {
        listeningPort: get('PORT').required().asPortNumber(),
        adminDeskUrl: get('ADMIN_DESK_URL').required().asString(),
        classTrackUrl: get('CLASS_TRACK_URL').required().asString(),
        databaseUrl: get('DATABASE_URL').required().asString(),
        nodeEnvironment: get('NODE_ENV').default('development').asString(),
        documentationUrl: get('DOCUMENTATION_URL').asString() ?? '',
        JWT_SEED: get('JWT_SEED').required().asString(),
        JWT_STUDENT_SEED: get('JWT_STUDENT_SEED').required().asString(),
        argumentValue: process.argv[2] ?? ''
    };
} catch (error: any) {
    
    console.error(ColorsAdapter.setRed('\n======================================================='));
    console.error(ColorsAdapter.setRed(' 🚨 FATAL ERROR: VARIABLES DE ENTORNO INVÁLIDAS 🚨'));
    console.error(ColorsAdapter.setRed('======================================================='));
    console.error(ColorsAdapter.setRed(` Detalle: ${error.message}`));
    console.error(ColorsAdapter.setRed(' Acción: Revisa tus archivos .env o tu configuración en Docker.\n'));


    process.exit(1);
}


export const environmentVariables = validatedEnvs;