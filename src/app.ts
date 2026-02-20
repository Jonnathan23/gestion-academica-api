import { CorsConfig, environmentVariables } from "@/core/config";
import { AppRouter, Server } from "@/core/server";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { ColorsAdapter } from "@/core/utils";
import { SequelizeErrorHandler } from "@/data/errors/SequelizeErrorHandler";

(() => {
    main();
})();


async function main() {
    console.log(ColorsAdapter.setGreen('Iniciando el servidor...\n'))

    const routes = AppRouter.routes;
    const cors = new CorsConfig({
        frontendUrl: environmentVariables.frontendUrl,
        commandLineArgument: environmentVariables.argumentValue,
    })

    const db = new DatabaseConnection({ ulrDatabase: environmentVariables.databaseUrl })
    const databaseErrorHandler = new SequelizeErrorHandler();

    await db.connect()

    const server = new Server({
        port: environmentVariables.listeningPort,
        routes,
        cors,
        databaseErrorHandler
    })

    await server.start();

}