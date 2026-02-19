import { CorsConfig, envs } from "@/core/config";
import { AppRouter, Server } from "@/core/server";

(() => {
    main();
})();


async function main() {
    const routes = AppRouter.routes;
    const cors = new CorsConfig({
        FRONTEND_URL: envs.FRONTEND_URL,
        argv_2: envs.argv_2,
    })
    /*
        const db = new DatabaseConnection({
            ulrDatabase: envs.DATABASE_URL,
            logging: false// envs.DEVELOPMENT ? true : false
        })
    
        await db.connect()
    */
    const server = new Server({
        port: envs.PORT,
        routes,
        cors
    })

    await server.start();

}