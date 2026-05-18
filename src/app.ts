import { CorsConfig, environmentVariables } from "@/core/config";
import { AppRouter, Server } from "@/core/server";
import { DatabaseConnection } from "@/data/config/db-postgresql";
import { ColorsAdapter } from "@/core/utils";
import { SequelizeErrorHandler } from "@/data/errors/SequelizeErrorHandler";
import { SwaggerConfiguration } from "@/core/config/swagger";

(() => {
    main();
})();


async function main() {
    console.log(ColorsAdapter.setGreen('Iniciando el servidor...\n'))

    const routes = AppRouter.routes;
    const cors = new CorsConfig({
        frontendUrls: [
            environmentVariables.adminDeskUrl,
            environmentVariables.classTrackUrl
        ],
        commandLineArgument: environmentVariables.argumentValue,
        documentationUrl: environmentVariables.documentationUrl
    })

    const isTestEnvironment = environmentVariables.nodeEnvironment === 'test';

    const databaseConnection = new DatabaseConnection({
        databaseUrl: environmentVariables.databaseUrl,
        forceSynchronization: isTestEnvironment
    });

    await databaseConnection.connect()


    const databaseErrorHandler = new SequelizeErrorHandler();

    const documentation = environmentVariables.nodeEnvironment === 'test' ? new SwaggerConfiguration() : undefined;

    const server = new Server({
        port: environmentVariables.listeningPort,
        routes,
        cors,
        databaseErrorHandler,
        documentation
    })

    await server.start();

}