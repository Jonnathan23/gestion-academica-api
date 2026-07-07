import express, { Router } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import type { SwaggerConfiguration } from "@/core/config/swagger";
import { ColorsAdapter } from "@/core/utils/adapters/colors";
import { CorsConfig } from "@/core/config/cors";
import type { DatabaseErrorHandler } from "@/core/interfaces/database-error-handler.interface";
import { createGlobalErrorHandler } from "@/core/middleware/globalErrorHandler.mid";

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

    private readonly defaultPort = 4000;

    public constructor({ port = this.defaultPort, routes, cors, databaseErrorHandler, documentation }: ServerProps) {
        this.port = port;
        this.routes = routes;
        this.cors = cors;
        this.databaseErrorHandler = databaseErrorHandler;
        this.documentation = documentation;
    }

    public async start() {
        // Middlewares
        this.app.use(morgan("dev"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

        this.app.use(cookieParser());

        const corsOptions = this.cors.corsOptions;

        this.app.use(cors(corsOptions));

        if (this.documentation) {
            this.app.use(express.static("public"));
            this.app.use("/docs", this.documentation.serve, this.documentation.setup());
        }

        this.app.use("/api", this.routes);

        this.app.use(createGlobalErrorHandler(this.databaseErrorHandler));

        this.app.listen(this.port, () => {
            console.info(ColorsAdapter.setCyanBold(`Server running on port ${this.port}`));
        });
    }
}
