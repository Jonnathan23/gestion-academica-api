import { get } from "env-var";

export const environmentVariables = {
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