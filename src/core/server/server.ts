import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ColorsAdapter } from "../utils/adapters/colors";
import type { CorsConfig } from "../config/cors";




interface ServerProps {
    port: number;
    routes: Router;
    cors: CorsConfig;
}

export class Server {
    public readonly app = express()
    private readonly port: number;
    private readonly routes: Router;
    private readonly cors: CorsConfig;

    constructor({ port = 4000, routes, cors }: ServerProps) {
        this.port = port;
        this.routes = routes;
        this.cors = cors;
    }

    async start() {
        //Middlewares
        this.app.use(morgan('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true })) //x-www-form-urlencoded

        const corsOptions = this.cors.corsOptions
        this.app.use(cors(corsOptions))
        this.app.use(this.routes)

        this.app.listen(this.port, () => {
            console.log(ColorsAdapter.setCyanBold(`Server running on port ${this.port}`));
        });
    }

}