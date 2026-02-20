import { CorsConfig, environmentVariables } from "@/core/config";
import { AppRouter, Server } from "@/core/server";
import { DatabaseConnection } from "@/data/db";
import { ColorsAdapter } from "@/core/utils";

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

    await db.connect()

    const server = new Server({
        port: environmentVariables.listeningPort,
        routes,
        cors
    })

    await server.start();

}