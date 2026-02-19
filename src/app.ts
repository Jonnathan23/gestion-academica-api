import { CorsConfig, environmentVariables } from "@/core/config";
import { AppRouter, Server } from "@/core/server";

(() => {
    main();
})();


async function main() {
    const routes = AppRouter.routes;
    const cors = new CorsConfig({
        frontendUrl: environmentVariables.frontendUrl,
        commandLineArgument: environmentVariables.argumentValue,
    })
    /*
        const db = new DatabaseConnection({
            ulrDatabase: environmentVariables.databaseUrl,
            logging: false// envs.DEVELOPMENT ? true : false
        })
    
        await db.connect()
    */
    const server = new Server({
        port: environmentVariables.listeningPort,
        routes,
        cors
    })

    console.log(environmentVariables.nodeEnvironment)

    await server.start();

}