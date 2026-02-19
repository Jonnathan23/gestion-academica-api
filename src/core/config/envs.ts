import { get } from "env-var";

export const envs = {
    PORT: get('PORT').required().asPortNumber(), 
    FRONTEND_URL: get('FRONTEND_URL').required().asString(),
    argv_2: process.argv[2] ?? '',   
}