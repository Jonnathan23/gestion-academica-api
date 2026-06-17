import { get } from "env-var";
import { ColorsAdapter } from "@/core/utils"; // Aprovechamos tu adaptador de colores

interface EnvironmentVariables {
    listeningPort: number;
    adminDeskUrl: string;
    classTrackUrl: string;
    databaseUrl: string;
    nodeEnvironment: string;
    documentationUrl: string;
    JwtSeed: string;
    JwtStudentSeed: string;
    argumentValue: string;
    secureCookies: boolean;
}

let validatedEnvs: EnvironmentVariables;

try {
    validatedEnvs = {
        listeningPort: get("PORT").required().asPortNumber(),
        adminDeskUrl: get("ADMIN_DESK_URL").required().asString().trim(),
        classTrackUrl: get("CLASS_TRACK_URL").required().asString().trim(),
        databaseUrl: get("DATABASE_URL").required().asString().trim(),
        nodeEnvironment: get("NODE_ENV").default("development").asString().trim(),
        documentationUrl: get("DOCUMENTATION_URL").asString()?.trim() ?? "",
        JwtSeed: get("JWT_SEED").required().asString().trim(),
        JwtStudentSeed: get("JWT_STUDENT_SEED").required().asString().trim(),
        argumentValue: process.argv[2]?.trim() ?? "",
        secureCookies: get("USE_SECURE_COOKIES").default("false").asBool(),
    };
} catch (error: unknown) {
    console.error(ColorsAdapter.setRed("\n======================================================="));
    console.error(ColorsAdapter.setRed(" 🚨 FATAL ERROR: VARIABLES DE ENTORNO INVÁLIDAS 🚨"));
    console.error(ColorsAdapter.setRed("======================================================="));
    console.error(ColorsAdapter.setRed(` Detalle: ${error}`));
    console.error(ColorsAdapter.setRed(" Acción: Revisa tus archivos .env o tu configuración en Docker.\n"));

    process.exit(1);
}

export const environmentVariables = validatedEnvs;
