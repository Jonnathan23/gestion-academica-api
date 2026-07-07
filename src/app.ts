import { DatabaseConnection } from "@/data/config/db-postgresql";
import { SequelizeErrorHandler } from "@/data/errors/sequelize-error-handler.error";
import { SwaggerConfiguration } from "@/core/config/swagger";
import { CorsConfig } from "@/core/config/cors";
import { environmentVariables } from "@/core/config/envs";
import { AppRouter } from "@/core/server/router";
import { Server } from "@/core/server/server";
import { ColorsAdapter } from "@/core/utils/adapters/colors";

(() => {
    main();
})();

async function main() {
    console.info(ColorsAdapter.setGreen("Iniciando el servidor...\n"));

    const routes = AppRouter.routes;
    const cors = new CorsConfig({
        frontendUrls: [environmentVariables.adminDeskUrl, environmentVariables.classTrackUrl],
        commandLineArgument: environmentVariables.argumentValue,
        documentationUrl: environmentVariables.documentationUrl,
    });

    const isTestEnvironment = environmentVariables.nodeEnvironment === "test";

    const databaseConnection = new DatabaseConnection({
        databaseUrl: environmentVariables.databaseUrl,
        forceSynchronization: isTestEnvironment,
    });

    await databaseConnection.connect();

    const databaseErrorHandler = new SequelizeErrorHandler();

    const documentation = environmentVariables.nodeEnvironment === "test" ? new SwaggerConfiguration() : undefined;

    const server = new Server({
        port: environmentVariables.listeningPort,
        routes,
        cors,
        databaseErrorHandler,
        documentation,
    });

    await server.start();
}
