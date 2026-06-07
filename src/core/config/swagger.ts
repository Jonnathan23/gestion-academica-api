import swaggerJsdoc, { type Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

interface SwaggerUserInterfaceOptions {
    customCss: string;
    customSiteTitle: string;
}

export class SwaggerConfiguration {
    private readonly swaggerSpecification: object;
    private readonly userInterfaceOptions: SwaggerUserInterfaceOptions;

    constructor() {
        const swaggerOptions: Options = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "AdminDesk & ClassTrack API",
                    version: "1.0.0",
                    description: "RESTful API documentation for the academic management system.",
                },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT",
                        },
                    },
                },
            },
            apis: [
                "./src/app/**/*.ts", // Para leer los comentarios de los controladores
                "./src/data/models/**/*.ts", // Para leer las definiciones de los esquemas
            ],
        };

        this.swaggerSpecification = swaggerJsdoc(swaggerOptions);

        this.userInterfaceOptions = {
            customCss: `
            /* 1. Definición de la Paleta de Colores (Variables Globales) */
            :root {
                --primary-orange: #f36e2b;
                --secondary-orange: #c55a24;
                --dark-orange: #a85226;
                --light-teal: #a0e3d5;
                --mid-teal: #73bbac;
                --dark-teal: #578f83;
                --beige-accent: #cbbd91;
                --dark-brown: #685c46;
            }

            /* 2. Barra Superior (Topbar) */
            .swagger-ui .topbar {
                background-color: var(--dark-teal);
                border-bottom: 4px solid var(--primary-orange);
            }

            /* 3. Reemplazo del Logo por tu Portada */
            .swagger-ui .topbar-wrapper .link {
                
                height: 60px; /* Ligeramente ajustado para mantener la proporción de la barra */
                width: auto;
                max-width: 300px;
                object-fit: contain;
                padding-bottom: 5px;
            }
            
            /* Ocultar el logo de Swagger original por seguridad */
            .swagger-ui .topbar-wrapper img {
                display: none;
            }

            /* 4. Tipografía y Títulos */
            .swagger-ui .info .title {
                color: var(--dark-teal);
            }
            .swagger-ui .info h1, 
            .swagger-ui .info h2, 
            .swagger-ui .info h3, 
            .swagger-ui .info h4, 
            .swagger-ui .info h5, 
            .swagger-ui .info p {
                color: var(--dark-brown);
            }

            /* 5. Botones de Acción (Authorize, Try it out, Execute) */
            .swagger-ui .btn.execute,
            .swagger-ui .btn.authorize {
                background-color: var(--primary-orange);
                color: white;
                border-color: var(--secondary-orange);
                box-shadow: 0 2px 4px rgba(197, 90, 36, 0.3);
                transition: all 0.3s ease;
            }
            .swagger-ui .btn.execute:hover,
            .swagger-ui .btn.authorize:hover {
                background-color: var(--secondary-orange);
                border-color: var(--dark-orange);
                box-shadow: 0 4px 8px rgba(168, 82, 38, 0.4);
            }

            /* 6. Suavizar los bordes de los bloques de Endpoints */
            .swagger-ui .opblock {
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(104, 92, 70, 0.1);
            }
            `,
            customSiteTitle: "API Docs - AdminDesk & ClassTrack",
        };
    }

    public get serve() {
        return swaggerUi.serve;
    }

    public setup() {
        return swaggerUi.setup(this.swaggerSpecification, this.userInterfaceOptions);
    }
}
