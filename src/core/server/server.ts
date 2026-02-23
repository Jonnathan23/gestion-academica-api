import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { ColorsAdapter } from "@/core/utils";
import type { CorsConfig } from "@/core/config";
import type { DatabaseErrorHandler } from '@/core/interfaces';
import { createGlobalErrorHandler } from '@/core/middleware';
import type { SwaggerConfiguration } from '@/core/config/swagger';




interface ServerProps {
    port: number;
    routes: Router;
    cors: CorsConfig;
    databaseErrorHandler: DatabaseErrorHandler;
    documentation?: SwaggerConfiguration;
}

export class Server {
    public readonly app = express();
    private readonly port: number;
    private readonly routes: Router;
    private readonly cors: CorsConfig;
    private readonly databaseErrorHandler: DatabaseErrorHandler;
    private readonly documentation?: SwaggerConfiguration;

    constructor({ port = 4000, routes, cors, databaseErrorHandler, documentation }: ServerProps) {
        this.port = port;
        this.routes = routes;
        this.cors = cors;
        this.databaseErrorHandler = databaseErrorHandler;
        this.documentation = documentation;
    }

    async start() {
        // Middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
        
        const corsOptions = this.cors.corsOptions;
        this.app.use(cors(corsOptions));        
        
        // Swagger
        if (this.documentation) {
            this.app.use(express.static('public'));
            this.app.use('/docs', this.documentation.serve, this.documentation.setup());
        }

        this.app.use('/api', this.routes);

        // Pasamos la dependencia al Factory del middleware global
        this.app.use(createGlobalErrorHandler(this.databaseErrorHandler));

        this.app.listen(this.port, () => {
            console.log(ColorsAdapter.setCyanBold(`Server running on port ${this.port}`));
        });
    }
}