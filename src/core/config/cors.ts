import type { CorsOptions } from 'cors';

interface CorsConfigurationOptions {
    frontendUrl: string;
    commandLineArgument: string;
}

export class CorsConfig {
    public readonly corsOptions: CorsOptions;

    constructor(options: CorsConfigurationOptions) {
        const { frontendUrl, commandLineArgument } = options;

        this.corsOptions = {
            origin: function (requestOrigin, callbackFunction) {
                const allowedOrigins: Array<string | undefined> = [frontendUrl];

                if (commandLineArgument === '--api') {
                    allowedOrigins.push(undefined);
                }

                if (allowedOrigins.includes(requestOrigin)) {
                    callbackFunction(null, true);
                } else {
                    callbackFunction(new Error('Origin not allowed by CORS policy'));
                }
            },

            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],

            credentials: true,

            //Soporte para navegadores antiguos (Smart TVs, IE11)
            optionsSuccessStatus: 200
        };
    }
}