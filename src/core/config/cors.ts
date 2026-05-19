import type { CorsOptions } from "cors";

interface CorsConfigurationOptions {
    frontendUrls: string[];
    commandLineArgument: string;
    documentationUrl: string;
}

export class CorsConfig {
    public readonly corsOptions: CorsOptions;

    constructor(options: CorsConfigurationOptions) {
        const { frontendUrls, commandLineArgument, documentationUrl } = options;

        this.corsOptions = {
            origin: function (requestOrigin, callbackFunction) {
                const allowedOrigins: Array<string | undefined> = [...frontendUrls];

                if (commandLineArgument === "--api") {
                    allowedOrigins.push(undefined);
                }

                if (documentationUrl) {
                    allowedOrigins.push(documentationUrl);
                }

                if (allowedOrigins.includes(requestOrigin)) {
                    callbackFunction(null, true);
                } else {
                    callbackFunction(new Error("Origin not allowed by CORS policy"));
                }
            },

            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

            allowedHeaders: ["Content-Type", "Authorization", "Accept"],

            credentials: true,

            //Soporte para navegadores antiguos (Smart TVs, IE11)
            optionsSuccessStatus: 200,
        };
    }
}
